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
		Country.fromName.set("South Korea", new Country("South Korea", 10337, 9272, Cities[0], Cities[1]));
		Country.fromName.set("North Korea", new Country("North Korea", 9667.8, 11447.7, Cities[2], Cities[3]));
		Country.fromName.set("North Papau", new Country("North Papau", 17979.0, -8775.0, Cities[4], Cities[5]))
		Country.fromName.set("West Papau", new Country("West Papau", 16187.0, -9287.0, Cities[7], Cities[8]))
		Country.fromName.set("South Papau", new Country("South Papau", 18619.0, -11463.0, Cities[9], Cities[10]))
		Country.fromName.set("Brunei", new Country("Brunei", 8635.0, -9543.0, Cities[11], Cities[12]))
		Country.fromName.set("East Malaysia", new Country("East Malaysia", 10171.0, -8775.0, Cities[13], Cities[14], Cities[15]))
		Country.fromName.set("Central Indonesia", new Country("Central Indonesia", 9403.0, -12231.0, Cities[16], Cities[17], Cities[18], Cities[19]))
		Country.fromName.set("East Indonesia", new Country("East Indonesia", 11834.25, -11332.25, Cities[20], Cities[21]))
		Country.fromName.set("Lower Indonesia", new Country("Lower Indonesia", 7995.0, -15559.0, Cities[22], Cities[23]))
		Country.fromName.set("West Indonesia", new Country("West Indonesia", 4539.0, -12359.0, Cities[24], Cities[25]))
		Country.fromName.set("South Vietnam", new Country("South Vietnam", 6976.5, -5567.0, Cities[26], Cities[27]))
		Country.fromName.set("North Vietnam", new Country("North Vietnam", 5691.5, -824.0, Cities[28], Cities[29]))
		Country.fromName.set("Laos", new Country("Laos", 4537.5, -1595.75, Cities[30], Cities[31], Cities[32]))
		Country.fromName.set("Cambodia", new Country("Cambodia", 5823.25, -5836.0, Cities[33], Cities[34]))
		Country.fromName.set("Thailand", new Country("Thailand", 4924.0, -4677.5, Cities[35], Cities[36], Cities[37]))
		Country.fromName.set("Myanmar (Burma)", new Country("Myanmar (Burma)", 2359.5, -2615.0, Cities[38], Cities[39], Cities[40], Cities[41], Cities[42]))
		Country.fromName.set("Bangladesh", new Country("Bangladesh", -71.75, -578.0, Cities[43], Cities[44]))
		Country.fromName.set("Bhutan", new Country("Bhutan", 56.5, 953.5, Cities[45]))
		Country.fromName.set("Northeast India", new Country("Northeast India", 1342.0, 1212.75, Cities[46], Cities[47]))
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