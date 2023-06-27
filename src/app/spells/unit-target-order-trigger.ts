// import { Transports } from 'app/transports-type';
// import { TransportManager } from 'app/transports/transport-manager';

// export const unitTargetOrderTrig: trigger = CreateTrigger();

// export function unitTargetOrder() {
// 	for (let i = 0; i < bj_MAX_PLAYERS; i++) {
// 		TriggerRegisterPlayerUnitEvent(unitTargetOrderTrig, Player(i), EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER, null);
// 	}

// 	TriggerAddCondition(
// 		unitTargetOrderTrig,
// 		Condition(() => {
// 			switch (GetIssuedOrderId()) {
// 				case 852047: //"unload"
// 					TransportManager.getInstance().orderUnload();
// 					break;

// 				default:
// 					break;
// 			}

// 			return false;
// 		})
// 	);
// }
