import { GameTimer } from 'app/game/game-timer-type';
import { GameTracking } from 'app/game/game-tracking-type';
import { GamePlayer, PlayerStatus } from 'app/player/player-type';

type AntiSpamData = {
	timer: timer;
	string: string;
	count: number;
};

export const AntiSpam = () => {
	const spamMap: Map<player, AntiSpamData> = new Map<player, AntiSpamData>();
	const threshold: number = 2;
	const t: trigger = CreateTrigger();

	for (let i = 0; i < bj_MAX_PLAYERS; i++) {
		TriggerRegisterPlayerChatEvent(t, Player(i), '', false);
	}

	TriggerAddCondition(
		t,
		Condition(() => {
			const player: player = GetTriggerPlayer();

			if (spamMap.has(player)) {
				if (
					GetEventPlayerChatString().includes(spamMap.get(player).string) &&
					GetEventPlayerChatString().length >= 21 &&
					spamMap.get(player).string.length >= 21
				) {
					spamMap.get(player).count++;
				}
			} else {
				spamMap.set(player, <AntiSpamData>{
					timer: CreateTimer(),
					string: GetEventPlayerChatString(),
					count: 1,
				});

				let duration: number = 1;
				let tick: number = 0.03;
				let timer: timer = spamMap.get(player).timer;

				TimerStart(timer, tick, true, () => {
					if (duration <= 0) {
						if (spamMap.get(player).count >= threshold) {
							if (!GameTracking.getInstance().roundInProgress) return;

							const gPlayer: GamePlayer = GamePlayer.fromPlayer.get(player);

							gPlayer.setStatus(PlayerStatus.FORFEIT);

							if (gPlayer.turnDied == -1) {
								gPlayer.setTurnDied(GameTimer.getInstance().turn);
							}

							if (gPlayer.cityData.endCities == 0) {
								gPlayer.cityData.endCities = gPlayer.cities.length;
							}

							SetPlayerState(gPlayer.player, PLAYER_STATE_OBSERVER, 1);
						}

						spamMap.delete(player);
						PauseTimer(timer);
						DestroyTimer(timer);
					}

					duration -= tick;
				});
			}

			return true;
		})
	);
};

// function FindChatBox takes nothing returns framehandle
//     local framehandle origin = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0)
//     local integer i = BlzFrameGetChildrenCount(origin) - 1
//     local framehandle frame

//     loop
//     exitwhen i < 0
//         set frame = BlzFrameGetChild(origin, i)

//         if BlzFrameGetHeight(frame) == 0.03 and BlzFrameGetWidth(frame) == 0.4 then
//             return frame
//         endif
//         set i = i - 1
//     endloop

//     return null
// endfunction
