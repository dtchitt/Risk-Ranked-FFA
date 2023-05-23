import { Transports } from "app/transports-type";
import { NEUTRAL_HOSTILE } from "resources/constants";
import { UID } from "resources/unitID";
import { UTYPE } from "resources/unitTypes";
import { FilterFriendlyValidGuards, FilterOwnedGuards, isGuardValid } from "./guard-filters";
import { compareValue } from "./guard-options";
import { File } from "w3ts";

export const Cities: City[] = [];
export const CityRegionSize: number = 185;

export const enterCityTrig: trigger = CreateTrigger();
export const leaveCityTrig: trigger = CreateTrigger();
export const unitTrainedTrig: trigger = CreateTrigger();

export class City {
	private _barrack: unit;
	private cop: unit;
	private _guard: unit;
	private region: region;
	private _x: number;
	private _y: number;
	private defaultGuardType: number;
	private defaultBarrackType: number;
	public counter: number;
	public counter2: number;
	public static fromBarrack = new Map<unit, City>();
	public static fromGuard = new Map<unit, City>();
	public static fromRegion = new Map<region, City>();
	public static cities: City[] = [];

	constructor(x: number, y: number, barrackType: number, name?: string, guardType: number = UID.RIFLEMEN) {
		this.defaultBarrackType = barrackType;
		this.setBarrack(x, y, name);

		//Create region
		const offSetX: number = x - 125;
		const offSetY: number = y - 255;

		let rect = Rect(offSetX - CityRegionSize / 2, offSetY - CityRegionSize / 2, offSetX + CityRegionSize / 2, offSetY + CityRegionSize / 2);
		this._x = GetRectCenterX(rect);
		this._y = GetRectCenterY(rect);
		this.counter = 0;
		this.counter2 = 0;
		this.region = CreateRegion();
		RegionAddRect(this.region, rect);
		RemoveRect(rect);
		City.fromRegion.set(this.region, this);

		TriggerRegisterEnterRegion(enterCityTrig, this.region, null);
		TriggerRegisterLeaveRegion(leaveCityTrig, this.region, null);
		//TODO: Refactor so I can rebuild cities
		TriggerRegisterUnitEvent(unitTrainedTrig, this.barrack, EVENT_UNIT_TRAIN_FINISH);

		let trigg = CreateTrigger()
		TriggerRegisterPlayerSelectionEventBJ(trigg, Player(0), true)

		TriggerAddAction(trigg, () => {
			if (IsUnitType(GetTriggerUnit(), UTYPE.CITY)) {
				this.counter = this.counter + 1;
				File.write("city" + this.counter.toString() + ".pld", "Cities[0] = new City(" + GetUnitX(GetTriggerUnit()).toString() + ", " + GetUnitY(GetTriggerUnit()).toString() + ", UID.CITY)");
			}
			if (IsUnitType(GetTriggerUnit(), UTYPE.SPAWN)) {
				this.counter2 = this.counter2 + 1;
				File.write("country" + this.counter2.toString() + ".pld", "Country.fromName.set(, new Country(, " + GetUnitX(GetTriggerUnit()).toString() + ", " + GetUnitY(GetTriggerUnit()).toString() + "))");
			}

		})

		//Create cop
		this.cop = CreateUnit(NEUTRAL_HOSTILE, UID.CONTROL_POINT, offSetX, offSetY, 270);

		this.defaultGuardType = guardType;
		this.setGuard(guardType);

		rect = null;
	}

	//Static API
	public static init() {
		//South Korea
		Cities[0] = new City(10653, 9950.1, UID.CITY)
		Cities[1] = new City(10769, 9005, UID.CITY)

		//North Korea
		Cities[2] = new City(9950, 12005, UID.CITY)
		Cities[3] = new City(9400, 10827.8, UID.CITY)

		//North Papau
		Cities[4] = new City(17792.0, -8128.0, UID.CITY)
		Cities[5] = new City(17984.0, -9600.0, UID.CITY)

		//West Papau
		Cities[6] = new City(16640.0, -8960.0, UID.CITY)
		Cities[7] = new City(16160.0, -9952.0, UID.PORT)
		//South Papau
		Cities[8] = new City(18624.0, -10688.0, UID.CITY)
		Cities[9] = new City(18208.0, -12320.0, UID.PORT)
		//Brunei
		Cities[10] = new City(8384.0, -9792.0, UID.CITY)
		Cities[11] = new City(8608.0, -8992.0, UID.PORT)
		// //East Malaysia
		Cities[12] = new City(10368.0, -8128.0, UID.CITY)
		Cities[13] = new City(9600.0, -8704.0, UID.CITY)
		Cities[14] = new City(8576.0, -10880.0, UID.CITY)
		//Central Indonesia
		Cities[15] = new City(8640.0, -12096.0, UID.CITY)
		Cities[16] = new City(9856.0, -11392.0, UID.CITY)
		Cities[17] = new City(10560.0, -9728.0, UID.CITY)
		Cities[18] = new City(9760.0, -12896.0, UID.PORT)
		//East Indonesia
		Cities[19] = new City(12224.0, -10496.0, UID.CITY)
		Cities[20] = new City(12544.0, -11456.0, UID.CITY)
		//Lower Indonesia
		Cities[21] = new City(7104.0, -15040.0, UID.CITY)
		Cities[22] = new City(8928.0, -15136.0, UID.PORT)
		//West Indonesia
		Cities[23] = new City(5824.0, -13760.0, UID.CITY)
		Cities[24] = new City(4032.0, -11328.0, UID.CITY)
		Cities[25] = new City(4032.0, -11328.0, UID.CITY)

		//South Vietnam
		Cities[26] = new City(6592.0, -6016.0, UID.CITY)
		Cities[27] = new City(7104.0, -4864.0, UID.CITY)
		//North Vietnam
		Cities[28] = new City(5696.0, -2240.0, UID.CITY)
		Cities[29] = new City(5440.0, -256.0, UID.CITY)
		//Laos
		Cities[30] = new City(6144.0, -3712.0, UID.CITY)
		Cities[31] = new City(4416.0, -2496.0, UID.CITY)
		Cities[32] = new City(4480.0, -1088.0, UID.CITY)
		//Cambodia
		Cities[33] = new City(5344.0, -6688.0, UID.PORT)
		Cities[34] = new City(5888.0, -5376.0, UID.CITY)
		//Thailand
		Cities[35] = new City(4032.0, -4928.0, UID.CITY)
		Cities[36] = new City(4608.0, -3776.0, UID.CITY)
		Cities[37] = new City(3264.0, -2944.0, UID.CITY)
		//Myanmar (Burma)
		Cities[38] = new City(2176.0, -3584.0, UID.CITY)
		Cities[39] = new City(2112.0, -1728.0, UID.CITY)
		Cities[40] = new City(3136.0, -832.0, UID.CITY)
		Cities[41] = new City(1920.0, -256.0, UID.CITY)
		Cities[42] = new City(2624.0, 1280.0, UID.CITY)
		Cities[43] = new City(-512.0, 128.0, UID.CITY)
		Cities[44] = new City(288.0, -1376.0, UID.PORT)
		//Bhutan
		Cities[45] = new City(0.0, 1408.0, UID.CITY)
		//North East India
		Cities[46] = new City(1088.0, 576.0, UID.CITY)
		Cities[47] = new City(1984.0, 1920.0, UID.CITY)
		//Nepal
		Cities[48] = new City(-2432.0, 1664.0, UID.CITY)
		Cities[49] = new City(-1344.0, 1088.0, UID.CITY)

		//Tibet
		Cities[50] = new City(-2496.0, 4416.0, UID.CITY)
		Cities[51] = new City(-1024.0, 3008.0, UID.CITY)
		Cities[52] = new City(896.0, 3456.0, UID.CITY)
		Cities[53] = new City(2688.0, 2944.0, UID.CITY)


		this.onEnter();
		this.onLeave();
		this.onTrain();
	}

	public static onCast() {
		let trigUnit: unit = GetTriggerUnit();
		let targUnit: unit = GetSpellTargetUnit()
		const city: City = City.fromBarrack.get(trigUnit);

		if (!city.isPort() && IsUnitType(targUnit, UTYPE.SHIP)) return false;

		if ((IsUnitType(city.guard, UTYPE.SHIP) && IsTerrainPathable(GetUnitX(targUnit), GetUnitY(targUnit), PATHING_TYPE_FLOATABILITY)) ||
			(!IsUnitType(city.guard, UTYPE.SHIP) && IsTerrainPathable(GetUnitX(targUnit), GetUnitY(targUnit), PATHING_TYPE_WALKABILITY))) {
			city.changeGuard(targUnit);
		} else {
			let oldGuard: unit = city.guard;
			let x: number = GetUnitX(targUnit);
			let y: number = GetUnitY(targUnit);

			city.changeGuard(targUnit);
			SetUnitPosition(oldGuard, x, y);
			SetUnitPosition(city.guard, city.x, city.y);

			oldGuard = null;
		}

		city.setOwner(GetOwningPlayer(targUnit));
		trigUnit = null;
		targUnit = null;

		return false;
	}

	//Public API
	public get barrack(): unit {
		return this._barrack;
	}

	public get guard(): unit {
		return this._guard;
	}

	public get x(): number {
		return this._x;
	}
	public get y(): number {
		return this._y;
	}

	public isPort(): boolean {
		return GetUnitTypeId(this.barrack) == UID.PORT;
	}

	public isGuardShip(): boolean {
		return IsUnitType(this.guard, UTYPE.SHIP);
	}

	public isGuardDummy(): boolean {
		return GetUnitTypeId(this.guard) == UID.DUMMY_GUARD;
	}

	public getOwner(): player {
		return GetOwningPlayer(this.barrack);
	}


	public reset() {
		this.setOwner(NEUTRAL_HOSTILE)
		this.removeGuard(true);
		this.setGuard(this.defaultGuardType)
	}

	// public reset() {
	// 	const x: number = GetUnitX(this.barrack);
	// 	const y: number = GetUnitY(this.barrack);
	// 	const name: string = GetUnitName(this.barrack);

	// 	City.fromBarrack.delete(this.barrack);
	// 	RemoveUnit(this.barrack);
	// 	this._barrack = null;
	// 	this.setBarrack(x, y, name);
	// 	this.removeGuard(true);
	// 	this.setGuard(this.defaultGuardType);
	// }

	public changeGuardOwner() {
		SetUnitOwner(this._guard, this.getOwner(), true);
	}

	//removed full change boolean - never changes guard
	//removed reset rally boolean - always resets now
	//removed change color boolean - always change color
	//Previously updateOwner & changeOwner 
	public setOwner(newOwner: player) {
		if (this.getOwner() == newOwner) return false;

		SetUnitOwner(this.barrack, newOwner, true);
		SetUnitOwner(this.cop, newOwner, true);
		//SetUnitOwner(this.guard, newOwner, true);

		IssuePointOrder(this.barrack, "setrally", GetUnitX(this.barrack) - 70, GetUnitY(this.barrack) - 155)
	}

	//Internal Functions
	private setBarrack(x: number, y: number, name?: string) {
		this._barrack = CreateUnit(NEUTRAL_HOSTILE, this.defaultBarrackType, x, y, 270);
		City.fromBarrack.set(this.barrack, this);

		if (name && name != GetUnitName(this.barrack)) BlzSetUnitName(this.barrack, name);
	}

	/**
	 * Previously setGuard & createGuard
	 */
	private setGuard(guard: unit | number) {
		//TODO add null checking - 4/23/2022 idk what needs null checked maybe check if guard is null and handle it
		//TODO would this have fixed the ship not taking ports bug? 6-2-2022
		typeof guard === "number" ? this._guard = CreateUnit(NEUTRAL_HOSTILE, guard, this.x, this.y, 270) : this._guard = guard;
		UnitAddType(this.guard, UTYPE.GUARD);
		City.fromGuard.set(this.guard, this);
	}

	/**
	 * Previously removeGuard & deleteGuard 
	 */
	private removeGuard(destroy: boolean = false) {
		City.fromGuard.delete(this.guard);

		if (!destroy) {
			UnitRemoveType(this.guard, UTYPE.GUARD);
		} else {
			RemoveUnit(this.guard);
		}

		this._guard = null;
	}

	public changeGuard(newGuard: unit) {
		if (this.guard != newGuard) {
			this.removeGuard(this.isGuardDummy());
			this.setGuard(newGuard);
		}

		SetUnitPosition(this.guard, this.x, this.y);
	}

	private dummyGuard(owner: player) {
		this.changeGuard(CreateUnit(owner, UID.DUMMY_GUARD, this.x, this.y, 270));
		this.setOwner(owner);
	}

	private static onEnter() {
		TriggerAddCondition(enterCityTrig, Condition(() => {
			if (IsUnitType(GetTriggerUnit(), UTYPE.TRANSPORT)) return false;

			const city: City = City.fromRegion.get(GetTriggeringRegion());

			if (isGuardValid(city)) return false;

			city.changeGuard(GetTriggerUnit());
			city.setOwner(GetOwningPlayer(GetTriggerUnit()));

			return false;
		}));
	}

	private static onLeave() {
		TriggerAddCondition(leaveCityTrig, Condition(() => {
			if (!IsUnitType(GetTriggerUnit(), UTYPE.GUARD)) return false;

			const city: City = City.fromRegion.get(GetTriggeringRegion());
			let g: group = CreateGroup();
			let guardChoice: unit = city.guard;


			GroupEnumUnitsInRange(g, city.x, city.y, CityRegionSize, FilterOwnedGuards(city));

			if (BlzGroupGetSize(g) == 0) GroupEnumUnitsInRange(g, city.x, city.y, CityRegionSize, FilterFriendlyValidGuards(city));

			if (BlzGroupGetSize(g) == 0 && !isGuardValid(city)) {
				city.dummyGuard(GetOwningPlayer(city.barrack));
				return false;
			};

			ForGroup(g, () => {
				guardChoice = compareValue(GetEnumUnit(), guardChoice);
			});

			city.changeGuard(guardChoice);

			DestroyGroup(g);
			g = null;
			guardChoice = null;

			return false;
		}));
	}

	private static onTrain() {
		TriggerAddCondition(unitTrainedTrig, Condition(() => {
			const city: City = City.fromBarrack.get(GetTriggerUnit());
			let trainedUnit: unit = GetTrainedUnit();

			if (city.isPort()) {
				if (IsUnitType(trainedUnit, UTYPE.TRANSPORT)) {
					Transports.onCreate(trainedUnit);
				}

				if (city.isGuardShip() && !IsUnitType(trainedUnit, UTYPE.SHIP)) {
					city.changeGuard(trainedUnit);
				}
			}

			trainedUnit = null;
			return false;
		}))
	}
}