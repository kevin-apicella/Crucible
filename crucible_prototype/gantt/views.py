from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import JsonResponse
import json
from django.core.serializers.json import DjangoJSONEncoder
from django.conf import settings
from pathlib import Path
import uuid
from .models import Journey, Task, Resource, Assignment, Dependency
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime


class TimelineView(TemplateView):
    template_name = "index.html"


def load_initial_data(request):
    existing_journey = get_journey_for_member(request.user.id)
    # if (False):
    if existing_journey is None:
        print("existing journey is none")
        data_path = Path(settings.BASE_DIR) / 'crucible_prototype' /'gantt' /  'static' / 'data' / 'data-trial3.json'

        with open(data_path, 'r') as file:
            data = json.load(file)

            today_date = datetime.now().date()
            new_journey = Journey.objects.create(
                title="My Journey",
                description="My journey description",
                startDate=today_date,
            )
            # data.get('project', {}).get('startDate')
            new_journey.owners.add(request.user)
            new_journey.save()

            tasks = data.get('tasks', {}).get('rows', [])
            user_id = request.user.id
            for task_data in tasks:
                create_task_from_json(task_data, user_id, new_journey)

            resources = data.get('resources', {}).get('rows', [])
            for resource in resources:
                resource_id = resource.get('id')
                name = resource.get('name')
                role = resource.get('role')
                resource = Resource.objects.create(
                    name=name,
                    role=role,
                    journey=new_journey
                )

            assignments = data.get('assignments', {}).get('rows', [])
            for assignment in assignments:
                resource_id = assignment.get('resourceId')
                event_id = assignment.get('eventId')
                # resource = Resource.objects.get(id=resource_id)
                event = Task.objects.get(unique_id=event_id + str(request.user.id))
                
                assignment = Assignment.objects.create(
                    resource=resource,
                    event=event,
                    journey=new_journey
                )

            dependencies = data.get('dependencies', {}).get('rows', [])
            for dependency in dependencies:
                from_event_id = dependency.get('fromEvent')
                to_event_id = dependency.get('toEvent')
                try:
                    from_event = Task.objects.get(unique_id=from_event_id + str(request.user.id))
                except Task.DoesNotExist:
                    print(f"Task with unique_id {from_event_id + str(request.user.id)} does not exist")
                try:
                    to_event = Task.objects.get(unique_id=to_event_id + str(request.user.id))
                except Task.DoesNotExist:
                    print(f"Task with unique_id {from_event_id + str(request.user.id)} does not exist")

                dependency_id = str(dependency.get('id')) + str(request.user.id)
                
                dependency = Dependency.objects.create(
                    # id=dependency_id,
                    from_event=from_event,
                    to_event=to_event,
                    journey=new_journey
                )

        return JsonResponse(data)

    else:

        # Journey.objects.all().delete()
        # Task.objects.all().delete()
        # Assignment.objects.all().delete()
        # Resource.objects.all().delete()
        # Dependency.objects.all().delete()
        

        tasks = existing_journey.from_tasks.filter(parent=None)
        tasks_list = [serialize_task(task) for task in tasks]

        resources = Resource.objects.values('id', 'name', 'role')
        resources_list = [{'id': resource['id'], 'name': resource['name'], 'role': resource['role']} for resource in resources]

        assignments = existing_journey.from_assignments.values('id', 'resource_id', 'event_id')
        assignments_list = [{'id': assignment['id'], 'resourceId': assignment['resource_id'], 'eventId': assignment['event_id']} for assignment in assignments]

        dependencies = existing_journey.from_dependencies.values('id', 'from_event_id', 'to_event_id', 'lag')
        dependencies_list = [
            {
                'id': dependency['id'],
                'fromEvent': dependency['from_event_id'],
                'toEvent': dependency['to_event_id'],
                'lag': dependency['lag']
            } 
            for dependency in dependencies
        ]

        start_date = existing_journey.startDate
        
        return JsonResponse({
            "project" : {
            "calendar"  : "general",
            "startDate" : start_date
            },
            "calendars" : {
                "rows" : [
                    {
                    "id"        : "general",
                    "name"      : "General",
                    "intervals" : [
                        {
                        "recurrentStartDate" : "on Sat at 0:00",
                        "recurrentEndDate"   : "on Mon at 0:00",
                        "isWorking"          : True
                        }
                    ]
                }
            ]
            },
            "tasks": {'rows': tasks_list},
            "resources": {'rows': resources_list},
            "assignments": {'rows': assignments_list},
            "dependencies": {'rows': dependencies_list},
        })


@csrf_exempt
def sync_data(request):
    existing_journey = get_journey_for_member(request.user.id)

    if request.method == 'POST':
        data = json.loads(request.body)

        created_tasks = data.get('tasks', {}).get('added', [])
        phantom_tasks = {}
        for task_data in created_tasks:
            unique_id = str(uuid.uuid4())
            duration = task_data.get('duration', 0)
            name = task_data.get('name')
            expanded = task_data.get('expanded', True)
            status = task_data.get('status', 'Todo')
            eventColor = task_data.get('eventColor', None)
            parent_id = task_data.get('parentId')
            parent = Task.objects.get(unique_id=parent_id + str(request.user.id)) if parent_id else None
            
            task = Task.objects.create(
                name=name,
                unique_id=unique_id,
                duration=duration,
                expanded=expanded,
                status=status,
                eventColor=eventColor,
                parent=parent,
                journey=existing_journey
            )
            phantom_tasks[task_data.get('$PhantomId')] = task

        updated_tasks = data.get('tasks', {}).get('updated', [])
        for task_data in updated_tasks:
            task_id = task_data.get('id')
            update_fields = {}
            if 'name' in task_data:
                update_fields['name'] = task_data['name']
            if 'expanded' in task_data:
                update_fields['expanded'] = task_data['expanded']
            if 'duration' in task_data:
                update_fields['duration'] = task_data['duration']
            if 'percentDone' in task_data:
                update_fields['percentDone'] = task_data['percentDone']
            if 'startDate' in task_data:
                update_fields['startDate'] = task_data['startDate']
            if 'endDate' in task_data:
                update_fields['endDate'] = task_data['endDate']
            if 'constraintType' in task_data:
                update_fields['constraintType'] = task_data['constraintType']
            if 'eventColor' in task_data:
                update_fields['eventColor'] = task_data['eventColor']
            if 'status' in task_data:
                update_fields['status'] = task_data['status']
            
            task, created = Task.objects.update_or_create(
                unique_id=task_id,
                defaults=update_fields
            )

        deleted_tasks = data.get('tasks', {}).get('removed', [])
        for task in deleted_tasks:
            task_id = task.get('id')
            Task.objects.filter(unique_id=task_id).delete()

        
        created_resources = data.get('resources', {}).get('added', [])
        for resource in created_resources:
            resource_id = resource.get('id')
            name = resource.get('name')
            role = resource.get('role')
            resource = Resource.objects.create(
                id=resource_id,
                name=name,
                role=role
            )

        updated_resources = data.get('resources', {}).get('updated', [])
        for resource in updated_resources:
            resource_id = resource.get('id')
            name = resource.get('name')
            role = resource.get('role')
            resource, created = Resource.objects.update_or_create(
                id=resource_id,
                defaults={'name': name, 'role': role}
            )

        deleted_resources = data.get('resources', {}).get('removed', [])
        for resource in deleted_resources:
            resource_id = resource.get('id')
            Resource.objects.filter(id=resource_id).delete()

        created_assignments = data.get('assignments', {}).get('added', [])
        for assignment in created_assignments:
            resource_id = assignment.get('resourceId')
            resource = Resource.objects.get(id=resource_id)
            event_id = assignment.get('eventId')
            event = Task.objects.get(unique_id=event_id + str(request.user.id))
            
            assignment = Assignment.objects.create(
                resource=resource,
                event=event,
                journey=existing_journey
            )

        updated_assignments = data.get('assignments', {}).get('updated', [])
        for assignment in updated_assignments:
            assignment_id = assignment.get('id')
            resource_id = assignment.get('resourceId')
            resource = Resource.objects.get(id=resource_id)
            
            assignment, created = Assignment.objects.update_or_create(
                id=assignment_id,
                defaults={'resource': resource}
            )

        deleted_assignments = data.get('assignments', {}).get('removed', [])
        for assignment in deleted_assignments:
            assignment_id = assignment.get('id')
            Assignment.objects.filter(id=assignment_id).delete()

        created_dependencies = data.get('dependencies', {}).get('added', [])
        for dependency in created_dependencies:
            dependency_id = dependency.get('id')
            from_event_id = dependency.get('fromEvent')
            to_event_id = dependency.get('toEvent')
            try:
                from_event = Task.objects.get(unique_id=from_event_id)
            except Task.DoesNotExist:
                if from_event_id in phantom_tasks:
                    from_event = phantom_tasks[from_event_id]
                else:
                    raise ValueError(f"Task with unique_id {from_event_id} not found")
            try:
                to_event = Task.objects.get(unique_id=to_event_id)
            except Task.DoesNotExist:
                if to_event_id in phantom_tasks:
                    to_event = phantom_tasks[to_event_id]
                else:
                    raise ValueError(f"Task with unique_id {to_event_id} not found")
            
            dependency = Dependency.objects.create(
                id=dependency_id,
                from_event=from_event,
                to_event=to_event,
                journey=existing_journey
            )

        updated_dependencies = data.get('dependencies', {}).get('updated', [])
        for dependency in updated_dependencies:
            from_event_id = dependency.get('fromEvent')
            lag = dependency.get('lag')
            dependency_id = dependency.get('id')

            if (lag is not None):
                dependency, created = Dependency.objects.update_or_create(
                    id=dependency_id,
                    defaults={'lag': lag}
                )

            if (from_event_id is not None):
                from_event = Task.objects.get(unique_id=from_event_id)
                dependency, created = Dependency.objects.update_or_create(
                    id=dependency_id,
                    defaults={'from_event': from_event}
                )

        deleted_dependencies = data.get('dependencies', {}).get('removed', [])
        for dependency in deleted_dependencies:
            dependency_id = dependency.get('id')
            Dependency.objects.filter(id=dependency_id).delete()
        
        return JsonResponse({'success': True})
    return JsonResponse({'error': 'Invalid request'}, status=400)


def create_task_from_json(task_data, user_id, journey, parent=None):
    task = Task.objects.create(
        unique_id=task_data.get('id') + str(user_id),
        name=task_data.get('name'),
        duration=task_data.get('duration', 0),
        expanded=task_data.get('expanded', True),
        eventColor=task_data.get('eventColor', None),
        status=task_data.get('status', 'Todo'),
        percentDone=task_data.get('percentDone', 0),
        parent=parent,
        journey=journey
    )

    for child_data in task_data.get('children', []):
        create_task_from_json(child_data, user_id, journey, parent=task)


def serialize_task(task):
    task_dict = {
        'id': task.unique_id,
        'name': task.name,
        'duration': task.duration,
        'percentDone': task.percentDone,
        'expanded': task.expanded,
        'startDate': task.startDate,
        'endDate': task.endDate,
        'constraintType': task.constraintType,
        'eventColor': task.eventColor,
        'status' : task.status,
        'children': []
    }
    
    for child in task.children.all():
        task_dict['children'].append(serialize_task(child))
    
    return task_dict

def get_journey_for_member(member_id):
    journey = Journey.objects.filter(owners__id=member_id).first()
    if journey:
        return journey
    else:
        return None
