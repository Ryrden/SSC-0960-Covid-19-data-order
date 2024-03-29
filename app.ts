import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";
import { CovidData } from "./covidData";

/* 
1- Os três países com os maiores valores de "Confirmed". Os nomes devem estar em ordem alfabética.
2- Dentre os dez países com maiores valores de "Active", a soma dos "Deaths" dos cinco países com menores valres de "Confirmed".
3- O maior valor de "Deaths" entre os países do hemisfério sul.
4- O maior valor de "Deaths" entre os países do hemisfério norte.
5- A soma de "Active" de todos os países em que "Confirmed" é maior ou igual que 1.000.000.
*/


const csvFilename = process.argv[2];
const csvFilePath = path.resolve(__dirname, csvFilename);

const headers = [
	"FIPS",
	"Admin2",
	"Province_State",
	"Country_Region",
	"Last_Update",
	"Lat",
	"Long_",
	"Confirmed",
	"Deaths",
	"Recovered",
	"Active",
	"Combined_Key",
	"Incident_Rate",
	"Case_Fatality_Ratio",
];

const fileContent = fs.readFileSync(csvFilePath, {encoding: "utf-8"});

parse(fileContent, {delimiter: ",", columns: headers}, (error, result: CovidData[]) => {
	if (error) {
		console.error(error);
	}
	result.shift() //removing header result array

	/*----- Q1 -----*/
	let threeBiggerConfirmedOnList: String[] = result
												.sort((a,b) =>  b.Confirmed - a.Confirmed)
												.slice(0,3)
												.map(item => item.Country_Region);
	
	/*----- Q2 -----*/
	let sumOfDeaths: Number = result
								.sort((a,b) => b.Active - a.Active)
								.slice(0,10)
								.sort((a,b) => a.Confirmed - b.Confirmed)
								.slice(0,5)
								.reduce((acc,curr) => +acc + +curr.Deaths,0)

	/*----- Q3 -----*/
	let HigherSouthHemisphereDeaths : Number = result
												.filter((data) => data.Lat < 0)
												.sort((a,b) => b.Deaths - a.Deaths)
												.slice(0,1)
												.reduce((acc,curr) => +acc + +curr.Deaths,0);
	
	/*----- Q4 -----*/
	let HigherNorthHemisphereDeaths : Number  = result
												.filter((data) => data.Lat > 0)
												.sort((a,b) => b.Deaths - a.Deaths)
												.slice(0,1)
												.reduce((acc,curr) => +acc + +curr.Deaths,0);
	
	/*----- Q5 -----*/								
	let ActiveSumWhereConfirmedCountrysIsBiggerThan1000000: Number = result
																	.filter((a) => a.Confirmed >= 1000000)
																	.reduce((acc,curr) => +acc + +curr.Active,0);
	
	console.log("Q1- " + threeBiggerConfirmedOnList); //Usando "+" para converter o array em string separado por ","
	console.log("Q2- " + sumOfDeaths);
	console.log("Q3- " + HigherSouthHemisphereDeaths);
	console.log("Q4- " + HigherNorthHemisphereDeaths);
	console.log("Q5- " + ActiveSumWhereConfirmedCountrysIsBiggerThan1000000);
});
