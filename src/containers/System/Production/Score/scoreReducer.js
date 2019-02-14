import Immutable from 'immutable';
import { scoreAction } from './scoreAction.js';

var initState = Immutable.fromJS({

})

const scoreReducer = (state = initState, action) => {
    switch (action.type) {
        case scoreAction.changeScoreStore:
            return state.merge(Immutable.fromJS(action.payload))
        case scoreAction.RESET_STORE:
            return initState;
    }
    return state;
}

export default scoreReducer;