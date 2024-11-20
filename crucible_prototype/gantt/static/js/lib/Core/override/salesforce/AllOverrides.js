import { MapPolyfill} from './vendor/lws-polyfills/map.js';
import { SetPolyfill } from './vendor/lws-polyfills/set.js';

// Worker is not supported by SecureWindow in Locker Service
// https://developer.salesforce.com/docs/component-library/tools/locker-service-viewer
if (window.Worker) {
    // The Worker constructor throws in LWS, but we only care about its existence as evidence
    // https://developer.salesforce.com/docs/component-library/tools/lws-distortion-viewer#Worker_constructor-value
    Map = MapPolyfill;
    Set = SetPolyfill;
}

// import createElementFromTemplate override first, as one of the patches below will rely on it
import './DomHelperOverride.js';

import './BrowserHelperOverridePointerEvents.js';
import './BrowserHelperOverrideQueryString.js';
import './ClickRepeaterOverride.js';
import './ComboOverride.js';
import './DomClassListOverride.js';
import './DomHelperOverrideActiveElement.js';
import './DomHelperOverrideElementFromPoint.js';
import './DomHelperOverrideGetCommonAncestor.js';
import './DomHelperOverrideIsInView.js';
import './DomHelperOverrideIsVisible.js';
import './DragHelperOverride.js';
import './EventHelperOverride.js';
import './EventHelperOverrideAddListener.js';
import './FieldOverrideAutocomplete.js';
import './FullscreenOverride.js';
import './NavigatorOverride.js';
import './ObjectsOverrideIsObject.js';
import './PanelOverride.js';
import './RectangleOverride.js';
import './WidgetOverrideExecuteAndAwaitAnimations.js';
import './WidgetOverrideGetFloatRoot.js';
import './WidgetOverrideSetDragImage.js';
import './WidgetOverrideToFront.js';
