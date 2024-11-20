// import '../css/style.css';
import { Toolbar, Toast } from './gantt.module.js';
import DateHelper from './lib/Core/helper/DateHelper.js';

import { Gantt } from './gantt.module.js';

const
    DH        = DateHelper,
    today     = DH.clearTime(new Date()),
    start     = DH.startOf(today, 'week');

class GanttToolbar extends Toolbar {
  static get type() {
    return 'gantttoolbar';
}

static get $name() {
    return 'GanttToolbar';
}

static get configurable() {
  return {
    items : {
      addTaskButton : {
          color    : 'b-blue',
          cls      : 'b-add-task-button',
          icon     : 'b-fa b-fa-plus',
          text     : 'Add Task',
          tooltip  : 'Create new task',
          onAction : 'up.onAddTaskClick'
      },
      undoRedo : {
        type  : 'undoredo',
        itemCls      : 'b-header-button',
        items : {
            transactionsCombo : null,
        }
      },
      toggleButtons : {
        type  : 'buttonGroup',
        items : {
            expandAllButton : {
                icon     : 'b-fa b-fa-angle-double-down',
                tooltip  : 'Expand all',
                onAction : 'up.onExpandAllClick',
                cls      : 'b-header-button'
            },
            collapseAllButton : {
                icon     : 'b-fa b-fa-angle-double-up',
                tooltip  : 'Collapse all',
                onAction : 'up.onCollapseAllClick',
                cls      : 'b-header-button'
            }
        }
      },
      zoomButtons : {
        type  : 'buttonGroup',
        items : {
            zoomInButton : {
                icon     : 'b-fa b-fa-search-plus',
                tooltip  : 'Zoom in',
                onAction : 'up.onZoomInClick',
                cls      : 'b-header-button'
            },
            zoomOutButton : {
                icon     : 'b-fa b-fa-search-minus',
                tooltip  : 'Zoom out',
                onAction : 'up.onZoomOutClick',
                cls      : 'b-header-button'
            },
            zoomToFitButton : {
                icon     : 'b-fa b-fa-compress-arrows-alt',
                tooltip  : 'Zoom to fit',
                onAction : 'up.onZoomToFitClick',
                cls      : 'b-header-button'
            },
            previousButton : {
                icon     : 'b-fa b-fa-angle-left',
                tooltip  : 'Previous time span',
                onAction : 'up.onShiftPreviousClick',
                cls      : 'b-header-button'
            },
            nextButton : {
                icon     : 'b-fa b-fa-angle-right',
                tooltip  : 'Next time span',
                onAction : 'up.onShiftNextClick',
                cls      : 'b-header-button'
            }
        }
      },
      startDateField : {
        type      : 'datefield',
        label     : 'Project start',
        required  : true, // (done on load)
        flex      : '0 0 18em',
        listeners : {
            change : 'up.onStartDateChange'
        }
      },
      filterByName : {
        type                 : 'textfield',
        cls                  : 'filter-by-name',
        flex                 : '0.2 0 13.5em',
        label                : '',
        placeholder          : 'Search',
        clearable            : true,
        keyStrokeChangeDelay : 100,
        triggers             : {
            filter : {
                align : 'end',
                cls   : 'b-fa b-fa-filter'
            }
        },
        onChange : 'up.onFilterChange'
      },
      // exportToPdfButton: {
      //   type : 'button',
      //   ref  : 'exportButton',
      //   icon : 'b-fa-file-export',
      //   text : 'Export to PDF',
      //   onClick() {
      //     gantt.features.pdfExport.showExportDialog();
      //   }
      // }
    }
  };
 }

 construct() {
  super.construct(...arguments);

  this.gantt = this.parent;
  this.gantt.project.on({
      load    : 'updateStartDateField',
      refresh : 'updateStartDateField',
      thisObj : this
  });
 }

 updateStartDateField() {
  const { startDateField } = this.widgetMap;

  startDateField.value = this.gantt.project.startDate;

  // This handler is called on project.load/propagationComplete, so now we have the
  // initial start date. Prior to this time, the empty (default) value would be
  // flagged as invalid.
  startDateField.required = true;
 }

 async onAddTaskClick() {
  const
      { gantt } = this,
      added     = gantt.taskStore.rootNode.appendChild({ name : this.L('New task'), duration : 1 });

  await gantt.project.sync();
  await gantt.project.load();
  await gantt.scrollRowIntoView(added);
}

onFilterChange({ value }) {
  if (value === '') {
      this.gantt.taskStore.clearFilters();
  }
  else {
      value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      this.gantt.taskStore.filter({
          filters : task => task.name && task.name.match(new RegExp(value, 'i')),
          replace : true
      });
  }
}

 onExpandAllClick() {
  this.gantt.expandAll();
}

onCollapseAllClick() {
  this.gantt.collapseAll();
}

onZoomInClick() {
  this.gantt.zoomIn();
}

onZoomOutClick() {
  this.gantt.zoomOut();
}

onZoomToFitClick() {
  this.gantt.zoomToFit({
      leftMargin  : 50,
      rightMargin : 50
  });
 }

 onShiftPreviousClick() {
  this.gantt.shiftPrevious();
}

onShiftNextClick() {
  this.gantt.shiftNext();
}

onAutoEditToggle({ item }) {
  this.gantt.features.cellEdit.autoEdit = item.checked;
}

onStartDateChange({ value, userAction }) {
  // Scroll to date only when user changes the date, not for the initial set
  // console.log("start date changed");
  // console.log(value, userAction);
  if (value && userAction) {
      this.gantt.scrollToDate(DateHelper.add(value, -1, 'week'), {
          block : 'start'
      });

      this.gantt.project.setStartDate(value);
  }
}
}

const headerTpl = ({ currentPage, totalPages }) => `
  <dl>
      <dt>Date: ${DateHelper.format(new Date(), 'll LT')}</dt>
      <dd>${totalPages ? `Page: ${currentPage + 1}/${totalPages}` : ''}</dd>
  </dl>
  `;

const footerTpl = () => `<h3>© ${new Date().getFullYear()} Bryntum AB</h3></div>`;

GanttToolbar.initClass();

const gantt = new Gantt({
    appendTo : 'gantt-container',

    showTaskColorPickers : true,

    // selectionMode : {
    //   cell       : true,
    //   dragSelect : true,
    //   rowNumber  : true
    // },

    features : {
      cellEdit      : {
        editNextOnEnterPress : false,
        addNewAtEnd : false,
        editNextOnEnterPress: false
      },
      dependencies : {
          radius     : 5,
          clickWidth : 5,
      },
      timeRanges : {
        showCurrentTimeLine : true
      },
      percentBar   : {
        allowResize    : true,
      },
      nonWorkingTime : false,
      // pdfExport : {
      //   exportServer: 'http://localhost:8080',
      //   translateURLsToAbsolute : 'http://localhost:8080/resources',
      //   headerTpl,
      //   footerTpl
      // },
      taskEdit : {
        items : {
          generalTab : {
              items : {
                  status : {
                      type  : 'combo',
                      label : 'Status',
                      name  : 'status',
                      flex  : 0.5,
                      items : [
                        ['Todo', 'Todo'],
                        ['In Progress', 'In Progress'],
                        ['Finished', 'Finished']
                      ]
                  }
              }
          }
        },
      },
    },

    taskRenderer({ taskRecord }) {
      let color = 'gantt-green';
        switch (taskRecord.status) {
          case 'Todo':
            color = 'pale-amber';
            break;
          case 'In Progress':
            color = 'gantt-blue';
            break;
          case 'Finished':
            color = 'gantt-green';
            break;
        }
      return {
          className : {
              status : true,
              [`b-taskboard-color-${color}`] : true,
              [ taskRecord.status ] : true
          }
      };
    },

    taskRenderer({ taskRecord, renderData }) {
      if (taskRecord.endDate < Date.now() && taskRecord.duration > 0) {
          renderData.style = "opacity:0.5";
      }

      return taskRecord.duration == 0 ? '' :  taskRecord.name;
    },

    scrollTaskIntoViewOnCellClick : true,

    columns : [
      { type : 'wbs', label: "Number", text: '', hidden: true},
      { type : 'name', text: 'Title', width : 350},
      { type : 'duration' , width: 100},
      { type : 'percentdone', showCircle : true, width : 100 , text: 'Status',
                 renderer: ({ record, cellElement, grid }) => {
                    const isTopLevelParent = record.parent === grid.store.rootNode;
                    if (!isTopLevelParent) {
                      cellElement.innerHTML = '';
                      cellElement.style.backgroundColor = 'transparent';
                      return '';
                    } else {
                      return undefined;
                    }
                  }
}

      // { type : 'startdate' },
      // { type : 'resourceassignment', width : 70, showAvatars : true },
    //   {
    //     text   : 'Status',
    //     field  : 'status',
    //     width  : 120,
    //     editor : {
    //         type       : 'combo',
    //         editable   : false,
    //         autoExpand : true,
    //         items      : [
    //             ['Todo', 'Todo'],
    //             ['In Progress', 'In Progress'],
    //             ['Finished', 'Finished']
    //         ]
    //     },
    //     renderer({ value }) {
    //       let color = 'gantt-green';
    //       switch (value) {
    //         case 'Todo':
    //           color = 'pale-amber';
    //           break;
    //         case 'In Progress':
    //           color = 'gantt-blue';
    //           break;
    //         case 'Finished':
    //           color = 'gantt-green';
    //           break;
    //       }
    //       return {
    //           className : {
    //               'status-tag' : true,
    //               [`b-taskboard-color-${color}`] : true
    //           },
    //           children : [
    //               { text : value }
    //           ]
    //       };
    //     }
    // }
  ],

    // startDate : '2024-06-16',
    // endDate   : '2024-08-15',

    project : {
      stm : {
        autoRecord : true,
      },
      resetUndoRedoQueuesAfterLoad : true,
      taskStore : {
        fields    : ['status', 'weight'],
        listeners : {
            update({ record : task, changes }) {
              if (changes.status) {
                switch (task.status) {
                  case 'Todo':
                    task.percentDone = 0;
                    break;
                  case 'In Progress':
                    task.percentDone = 50;
                    break;
                  case 'Finished':
                    task.percentDone = 100;
                    break;
                }
              }
            }
        }
      },
      transport: {
        load: {
          url: '/api/load/'
        },
        sync : {
          url: '/api/sync/'
      }
      },
      autoLoad : true,
      autoSync : true,
      manuallyScheduled: true,
      validateResponse: false,
      listeners : {
        load() {
          let date = new Date(1922, 9, 17);
          if (gantt.project.startDate != null && gantt.project.startDate.getTime() == date.getTime()) {
            gantt.project.setStartDate(today);
            location.reload();
          }
          gantt.scrollToDate(today, {
            block: 'start',
            edgeOffset: 100,
          });
          gantt.zoomToFit({
            leftMargin  : 50,
            rightMargin : 50
          });
          gantt.zoomIn();
          gantt.zoomIn();
        },
        sync() {
          // For testing
          console.log('synced');
          // console.log(gantt.project.data);
          console.log(gantt.project.data.calendar.stores[0].crudManager._crudStores[1].store._data);
        },
        hasChanges() {
            console.log('hasChanges');
            console.log(gantt.project.changes);
            // console.log("start date:");
            // console.log(gantt.project.startDate)


            // In a real app you would send the changes to the server here.
            // Then you would call `gantt.project.acceptChanges()` to
            // clear local changes.
        }
      }
    },

    viewPreset : {
      base : 'weekAndDayLetter',
      tickWidth  : 84,

      headers : [
        {
          unit       : 'month',
          dateFormat : 'MMM YYYY',
          align      : 'start'
        },
        {
          unit       : 'day',
          dateFormat : 'ddd DD'
        }
    ]
    },

    tbar : {
      type : 'gantttoolbar'
    }
});
