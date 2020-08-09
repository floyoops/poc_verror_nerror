import VError from "verror";
import readline from "readline";
import {VError as Nerror} from "@netflix/nerror";

let generateException: number | null = null;

class myException implements Error {
    public name: string;
    constructor(
        public readonly message: string,
        public readonly stack?: string) {
        this.name = 'myException;'
    }
}

function doubleValue(value: number): number {
    if (generateException === 2) {
        throw new Error(` error value '${value}'`);
    }
    return value * 2;
}

function htToTtc(priceHt: number): number {
    if (generateException === 3) {
        throw new Error(`error value '${priceHt}'`);
    }
    return priceHt * 1.196;
}

function marginPriceSale(priceHt: number): number {
    if (generateException === 1) {
        throw new Error(`error priceHt '${priceHt}'`);
    }
    priceHt = doubleValue(priceHt);
    priceHt = htToTtc(priceHt);
    return priceHt;
}

const rl = readline.createInterface({input: process.stdin, output: process.stdout});
rl.write("" +
    ". 1 Error\n" +
    ". 2 MyException\n" +
    ". 3 Verror\n" +
    ". 4 Netflix/Nerror\n\n");
let sellingPrice = 0;

let chooseExp = 1;
rl.question('what is your prefer exception ?\n', choose => {
    rl.write("\n");
    chooseExp = Number.parseInt(choose);
    rl.write("" +
        "marginPriceSale > doubleValue\n" +
        "marginPriceSale > htToTtc\n\n" +
        ". 1 marginPriceSale\n" +
        ". 2 doubleValue\n" +
        ". 3 htToTtc\n\n");
    rl.question('Generate exception on ?\n', chooseGenerateException => {
        rl.write("\n");
        generateException = Number.parseInt(chooseGenerateException);
        rl.question('your price HT purchasing ?\n', inPrice => {
            rl.write("\n");
            const purchasingPriceHt = Number.parseInt(inPrice);
            let error;
            try {
                sellingPrice = marginPriceSale(purchasingPriceHt);
            } catch (e) {
                switch (chooseExp) {
                    case 1:
                        error = new Error(e.message);
                        break;
                    case 2:
                        error = new myException(`Oups with your seizure priceHt '${inPrice}'`, e.stack);
                        break;
                    case 3:
                        error =  new VError({
                            'name': 'ErrorOnConvertPriceSelling',
                            'cause': e,
                            'info': {
                                'chooseExp': chooseExp,
                                'chooseGenerationException': chooseGenerateException,
                                'inPrice': inPrice,
                            },
                        }, `Oups with your seizure priceHt '${inPrice}'`);
                        break;
                    case 4:
                        error = new Nerror({
                            'name': 'ErrorOnConvertPriceSelling',
                            'cause': e,
                            'info': {
                                'chooseExp': chooseExp,
                                'chooseGenerationException': chooseGenerateException,
                                'inPrice': inPrice,
                            },
                        }, `Oups with your seizure priceHt '${inPrice}'`);
                        break;
                    default:
                        error = Error(e.message);
                }
            } finally {
                if (error !== undefined) {
                    console.log(error);
                } else {
                    console.log(`selling price TTC: ${sellingPrice}`);
                }

                process.exit(0);
            }
        });
    });
})

