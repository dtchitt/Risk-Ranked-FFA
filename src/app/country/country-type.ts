import { GamePlayer } from "app/player/player-type";
import { PlayLocalSound } from "libs/utils";
import { HexColors } from "resources/hexColors";
import { NEUTRAL_HOSTILE } from "resources/constants";
import { Cities, City } from "./city-type";
import { Spawner } from "./spawner-type";

export class Country {
	public name: string;
	private _cities: City[] = [];
	private spawner: Spawner;
	private text: texttag;
	private _owner: player;
	public citiesOwned: Map<GamePlayer, number> = new Map<GamePlayer, number>();
	public allocLim: number;

	public static fromName = new Map<string, Country>(); //Can be  gotten rid of and use fromCity instead
	public static fromCity = new Map<City, Country>();

	constructor(name: string, x: number, y: number, ...cities: City[]) {
		this.name = name;

		cities.forEach(city => {
			this.cities.push(city);
			Country.fromCity.set(city, this);
		});

		this.spawner = new Spawner(this.name, x, y, this.cities.length);

		const offsetX: number = GetUnitX(this.spawner.unit) - 100;
		const offsetY: number = GetUnitY(this.spawner.unit) - 300;
		const lengthCheck: number = this.name.length * 5.5 < 200 ? this.name.length * 5.5 : 200;

		this.text = CreateTextTag();
		SetTextTagText(this.text, `${HexColors.TANGERINE} ${this.name}`, 0.028);
		SetTextTagPos(this.text, offsetX - lengthCheck, offsetY, 16.00);
		SetTextTagVisibility(this.text, true);
		SetTextTagPermanent(this.text, true);

		this.allocLim = Math.floor(cities.length / 2);

		this._owner = NEUTRAL_HOSTILE;
	}

	//Static API
	public static init() {
		Country.fromName.set("Papua", new Country("Papua", 17340.0, -9419.25, Cities[1], Cities[2], Cities[3], Cities[4]))
		Country.fromName.set("Taiwan", new Country("Taiwan", 10306.25, 1852.5, Cities[5], Cities[6]))
		Country.fromName.set("Central Indonesia", new Country("East Indonesia", 9530.0, -10949.75, Cities[7], Cities[8], Cities[9], Cities[10]))
		Country.fromName.set("East Malaysia", new Country("East Malaysia", 9532.5, -8644.5, Cities[11], Cities[12]))
		Country.fromName.set("Brunei", new Country("Brunei", 8632.5, -9285.0, Cities[13]))
		Country.fromName.set("Lower Indonesia", new Country("Lower Indonesia", 7995.0, -15559.0, Cities[18], Cities[19]))
		Country.fromName.set("West Indonesia", new Country("West Indonesia", 4539.0, -12359.0, Cities[20], Cities[21], Cities[22]))
		Country.fromName.set("South Vietnam", new Country("South Vietnam", 6976.5, -5567.0, Cities[23], Cities[24]))
		Country.fromName.set("North Vietnam", new Country("North Vietnam", 5691.5, -824.0, Cities[25], Cities[26]))
		Country.fromName.set("Laos", new Country("Laos", 4537.5, -1595.75, Cities[27], Cities[28], Cities[29]))
		Country.fromName.set("Cambodia", new Country("Cambodia", 5823.25, -5836.0, Cities[30], Cities[31]))
		Country.fromName.set("Thailand", new Country("Thailand", 4924.0, -4677.5, Cities[32], Cities[33], Cities[34]))
		Country.fromName.set("Myanmar (Burma)", new Country("Myanmar (Burma)", 2359.5, -2615.0, Cities[35], Cities[36], Cities[37], Cities[38]))
		Country.fromName.set("Bangladesh", new Country("Bangladesh", -71.75, -578.0, Cities[39], Cities[40]))
		Country.fromName.set("Bhutan", new Country("Bhutan", 56.5, 953.5, Cities[41]))
		Country.fromName.set("Northeast India", new Country("Northeast India", 1342.0, 1212.75, Cities[42], Cities[43]))
		Country.fromName.set("Nepal", new Country("Nepal", -1994.0, 1087.75, Cities[44], Cities[45]))
		Country.fromName.set("Tibet (China)", new Country("Tibet", -1600.0, 3902.0, Cities[46], Cities[47], Cities[48], Cities[49]))
		Country.fromName.set("Xinjiang (China)", new Country("Xinjiang", -1731.75, 7089.25, Cities[50], Cities[51], Cities[52], Cities[53], Cities[54]))
		Country.fromName.set("Russia Far East", new Country("Russia Far East", 8895.75, 15546.25, Cities[55], Cities[65]))
		Country.fromName.set("West Malaysia", new Country("West Malaysia", 4668.0, -9800.0, Cities[56], Cities[57]))
		Country.fromName.set("Yunnan (China)", new Country("Yunnan (China)", 3771.0, 55.75, Cities[58], Cities[59]))
		Country.fromName.set("East Timor", new Country("East Timor", 13626.75, -15176.5, Cities[60], Cities[61]))
		Country.fromName.set("South Korea", new Country("South Korea", 10555.5, 9020.25, Cities[62]))
		Country.fromName.set("North korea", new Country("North Korea", 9656.75, 11199.0, Cities[63], Cities[64]))
		Country.fromName.set("Japan", new Country("Japan", 13501.0, 10550.5, Cities[66], Cities[67], Cities[68], Cities[69]))
		Country.fromName.set("Sapporo (Japan)", new Country("Sapporo (Japan)", 13369.5, 15293.25, Cities[70], Cities[71]))
		Country.fromName.set("North Philippines", new Country("North Philippines", 11192.25, -964.0, Cities[72], Cities[73]))
		Country.fromName.set("South Philippines", new Country("South Philippines", 12984.5, -5321.75, Cities[74], Cities[75]))
		Country.fromName.set("Hulunbuir Steppes (China)", new Country("Hulunbuir Steppes (China)", 7228.5, 13756.0, Cities[76], Cities[77], Cities[78]))
		Country.fromName.set("Northeast China", new Country("Northeast China", 8760.75, 12855.75, Cities[79], Cities[80], Cities[81], Cities[82]))
		Country.fromName.set("Inner Mongolia (China)", new Country("Inner Mongolia (China)", 3769.0, 7989.0, Cities[83], Cities[84], Cities[85], Cities[86]))
		Country.fromName.set("Mongolia", new Country("Mongolia", 3641.25, 12089.0, Cities[87], Cities[88], Cities[89], Cities[90]))
		Country.fromName.set("Central Russia", new Country("Central Russia", 2877.75, 15294.25, Cities[91], Cities[92], Cities[93]))
	}

	//Public API
	public get cities(): City[] {
		return this._cities;
	}

	public get size() {
		return this.cities.length;
	}

	public get owner(): player {
		return this._owner;
	}

	public animate() {
		if (this.owner == NEUTRAL_HOSTILE) return;

		this.cities.forEach(city => {
			const effect = AddSpecialEffect("Abilities\\Spells\\Human\\Resurrect\\ResurrectCaster.mdl", GetUnitX(city.barrack), GetUnitY(city.barrack));
			BlzSetSpecialEffectScale(effect, 1.10);
			DestroyEffect(effect);
		});
	}

	public initCitiesOwned() {
		GamePlayer.fromPlayer.forEach(gPlayer => {
			if (GetPlayerId(gPlayer.player) >= 25) return;

			this.citiesOwned.set(gPlayer, 0);
		});
	}

	public isOwned(): boolean {
		return this.owner == NEUTRAL_HOSTILE ? false : true
	}

	public step() {
		this.spawner.step();
	}

	public setOwner(who: player) {
		if (who == this.owner) return;

		GamePlayer.fromPlayer.get(this.owner).income -= this.cities.length;

		GamePlayer.fromPlayer.get(who).income += this.cities.length;
		this._owner = who;
		this.spawner.setOwner(who);

		this.animate();
		DisplayTimedTextToPlayer(who, 0.82, 0.81, 3.00, `${HexColors.TANGERINE}${this.name}|r has been conquered!`);

		PlayLocalSound("Sound\\Interface\\Rescue.flac", who);
	}

	public reset() {
		this._owner = NEUTRAL_HOSTILE;
		this.spawner.reset();
		this.initCitiesOwned();
	}
	//Internal Functions
}