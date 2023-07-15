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
		Country.fromName.set("Brunei", new Country("Brunei", 8633.0, -9796.0, Cities[13]))
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
		Country.fromName.set("South India", new Country("South India", -4164.5, -4932.75, Cities[94], Cities[95], Cities[96]))
		Country.fromName.set("Sri Lanka", new Country("Sri Lanka", -2887.75, -10440.25, Cities[97], Cities[98]))
		Country.fromName.set("Central India", new Country("Central India", -3655.0, -1997.0, Cities[99], Cities[100], Cities[101], Cities[102]))
		Country.fromName.set("West India", new Country("West India", -5953.0, 57.75, Cities[103], Cities[104], Cities[105]))
		Country.fromName.set("North India", new Country("North India", -4166.0, 3136.75, Cities[106], Cities[107], Cities[108]))
		Country.fromName.set("East China", new Country("East China", 6449.5, 3382.25, Cities[109], Cities[110], Cities[111], Cities[112], Cities[113], Cities[114], Cities[115], Cities[116]))
		Country.fromName.set("Central China", new Country("Central China", 2104.25, 5563.0, Cities[117], Cities[118], Cities[119], Cities[120]))
		Country.fromName.set("Pakistan", new Country("Pakistan", -6990.0, 1980.25, Cities[121], Cities[122], Cities[123], Cities[124], Cities[125]))
		Country.fromName.set("Iran", new Country("Iran", -11459.25, 4539.25, Cities[126], Cities[127], Cities[128], Cities[129], Cities[130]))
		Country.fromName.set("Azerbaijan", new Country("Azerbaijan", -12360.25, 8247.75, Cities[131], Cities[132]))
		Country.fromName.set("Armenia", new Country("Armenia", -13511.25, 8640.5, Cities[133]))
		Country.fromName.set("Georgia", new Country("Georgia", -13131.0, 9282.0, Cities[134]))
		Country.fromName.set("Yemen", new Country("Yemen", -13382.75, -2500.0, Cities[137], Cities[138]))
		Country.fromName.set("Oman", new Country("Oman", -10949.0, -1476.0, Cities[139], Cities[140]))
		Country.fromName.set("Saudi Arabia", new Country("Saudi Arabia", -12746.25, -838.0, Cities[141], Cities[142], Cities[143]))
		Country.fromName.set("UAE", new Country("UAE", -12231.0, 184.75, Cities[144], Cities[145]))
		Country.fromName.set("Afghanistan", new Country("Afghanistan", -7880.5, 4540.25, Cities[146], Cities[147], Cities[148], Cities[149]))
		Country.fromName.set("Turkmenistan", new Country("Turkmenistan", -9413.0, 7862.0, Cities[150], Cities[151]))
		Country.fromName.set("Tajikistan", new Country("Tajikistan", -5824.25, 6967.5, Cities[14], Cities[15]))
		Country.fromName.set("Kazakhstan", new Country("Kazakhstan", -5179.5, 12858.25, Cities[16], Cities[17], Cities[155], Cities[156], Cities[157], Cities[158]))
		Country.fromName.set("Kyrgyzstan", new Country("Kyrgyzstan", -4428.25, 7999.5, Cities[159], Cities[160]))
		Country.fromName.set("Mangystau (Kazakhstan)", new Country("Mangystau (Kazakhstan)", -10179.5, 10297.75, Cities[161], Cities[162]))
		Country.fromName.set("West Kazakhstan", new Country("West Kazakhstan", -10053.5, 12856.75, Cities[163], Cities[164], Cities[165], Cities[166]))
		Country.fromName.set("Uzbekistan", new Country("Uzbekistan", -7889.0, 8761.0, Cities[152], Cities[153], Cities[154]))
		Country.fromName.set("South Russia", new Country("South Russia", -12742.25, 11830.0, Cities[135], Cities[136], Cities[167]))
		Country.fromName.set("Hainan (China)", new Country("Hainan (China)", 6717.5, -1609.75, Cities[168]))
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