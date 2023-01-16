import ReactGA from 'react-ga4';

var DiplomaticActions = {};

DiplomaticActions.setFixedFrameMode = function setFixedFrameMode( state, mode ) {
   return {
       ...state,
       fixedFrameMode: mode 
   };
};

export default DiplomaticActions;