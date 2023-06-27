/**
 * For use with TriggerRegisterPlayerUnitEvent
 * EVENT_PLAYER_UNIT_LOADED =
 * GetTransportUnit = The transport being loaded
 * GetLoadedUnit = The unit being loaded
 * GetTriggerUnit = The unit being loaded
 *
 * IsUnitInTransport = Check if given unit is loaded into given transport
 * IsUnitLoaded = Check if given unit is loaded into any transport
 */

import { Transport } from './transport';
import { ErrorMessage } from 'libs/utils';
import { AID } from 'resources/abilityID';

export class TransportManager {
	private static instance: TransportManager;
	private transports: Map<unit, Transport>;

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new TransportManager();
		}

		return this.instance;
	}

	private constructor() {
		try {
			this.transports = new Map<unit, Transport>();
			this.onLoad();
		} catch (error) {
			print(error);
		}
	}

	public add(unit: unit) {
		const transport: Transport = {
			unit: unit,
			cargo: [],
			handlers: [],
		};

		this.transports.set(unit, transport);
		this.orderUnloadHandler(transport);
		this.spellEffectHandler(transport);
		this.spellEndCastHandler(transport);
	}

	public onDeath(unit: unit, killer: unit) {
		if (!this.transports.has(unit)) return;

		const transport: Transport = this.transports.get(unit);

		if (this.isTerrainInvalid(transport.unit)) {
			transport.cargo = transport.cargo.filter((unit) => {
				BlzSetUnitMaxHP(unit, 1);
				UnitDamageTarget(killer, unit, 100, true, false, ATTACK_TYPE_CHAOS, DAMAGE_TYPE_NORMAL, WEAPON_TYPE_WHOKNOWS);

				return false;
			});
		}

		transport.handlers.forEach((t) => DestroyTrigger(t));
		this.transports.delete(unit);
	}

	/**
	 * Handles the generic on load event that is based on the unit being loaded into a transport.
	 */
	private onLoad() {
		const t: trigger = CreateTrigger();

		for (let i = 0; i < bj_MAX_PLAYERS; i++) {
			TriggerRegisterPlayerUnitEvent(t, Player(i), EVENT_PLAYER_UNIT_LOADED, null);
		}

		TriggerAddCondition(
			t,
			Condition(() => {
				let trans: unit = GetTransportUnit();
				let loadedUnit: unit = GetLoadedUnit();

				this.transports.get(trans).cargo.push(loadedUnit);
				print(`there is ${this.transports.get(trans).cargo.length} units loaded - onLoad`);

				trans = null;
				loadedUnit = null;
				return true;
			})
		);
	}

	private orderUnloadHandler(transport: Transport) {
		try {
			const t = CreateTrigger();

			TriggerRegisterUnitEvent(t, transport.unit, EVENT_UNIT_ISSUED_TARGET_ORDER);

			TriggerAddCondition(
				t,
				Condition(() => {
					try {
						if (GetIssuedOrderId() == 852047) {
							if (this.isTerrainInvalid(transport.unit)) {
								BlzPauseUnitEx(transport.unit, true);
								BlzPauseUnitEx(transport.unit, false);
								IssueImmediateOrder(transport.unit, 'stop');
								ErrorMessage(GetOwningPlayer(transport.unit), 'You may only unload on pebble terrain!');
							} else {
								const index: number = transport.cargo.indexOf(GetOrderTargetUnit());

								transport.cargo.splice(index, 1);
							}
						}
					} catch (error) {
						print(error);
					}
					return false;
				})
			);

			transport.handlers.push(t);
		} catch (error) {
			print(error);
		}
	}

	private spellEffectHandler(transport: Transport) {
		const t = CreateTrigger();

		TriggerRegisterUnitEvent(t, transport.unit, EVENT_UNIT_SPELL_EFFECT);

		TriggerAddCondition(
			t,
			Condition(() => {
				if (this.isTerrainInvalid(transport.unit)) {
					if (GetSpellAbilityId() == AID.LOAD) {
						IssueImmediateOrder(transport.unit, 'stop');
						BlzPauseUnitEx(transport.unit, true);
						BlzPauseUnitEx(transport.unit, false);
						ErrorMessage(GetOwningPlayer(transport.unit), 'You may only load on pebble terrain!');
					} else if (GetSpellAbilityId() == AID.UNLOAD) {
						IssueImmediateOrder(transport.unit, 'stop');
						ErrorMessage(GetOwningPlayer(transport.unit), 'You may only unload on pebble terrain!');
					}
				}

				return false;
			})
		);

		transport.handlers.push(t);
	}

	private spellEndCastHandler(transport: Transport) {
		const t = CreateTrigger();

		TriggerRegisterUnitEvent(t, transport.unit, EVENT_UNIT_SPELL_ENDCAST);

		TriggerAddCondition(
			t,
			Condition(() => {
				if (GetSpellAbilityId() == AID.UNLOAD) {
					transport.cargo = transport.cargo.filter((unit) => IsUnitInTransport(unit, transport.unit));
				}

				return false;
			})
		);

		transport.handlers.push(t);
	}

	//TODO let the terrain be a setting
	private isTerrainInvalid(transport: unit): boolean {
		return GetTerrainType(GetUnitX(transport), GetUnitY(transport)) != FourCC('Vcbp');
	}
}
