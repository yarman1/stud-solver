import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';

const prisma = new PrismaClient();

async function importCsvToModel(csvFilePathArea: string, modelArea: string, csvFilePathProblem: string) {
    const dataArea = await new Promise<any[]>((resolve, reject) => {
        const results = [];
        fs.createReadStream(csvFilePathArea)
            .pipe(csvParser())
            .on('data', (row) => results.push(row))
            .on('end', () => resolve(results))
            .on('error', reject);
    });

    const dataProblem = await new Promise<any[]>((resolve, reject) => {
        const results = [];
        fs.createReadStream(csvFilePathProblem)
            .pipe(csvParser())
            .on('data', (row) => results.push(row))
            .on('end', () => resolve(results))
            .on('error', reject);
    });

    const processedAreas: any[] = [];
    for (const areaItem of dataArea) {
        const processedArea = {
            ...areaItem,
        };
        processedAreas.push(processedArea);
    }

    for (const problemItem of dataProblem) {
        const processedProblem = {
            ...problemItem,
        };
        const area = processedAreas.find(element => element.area_id === processedProblem.area_id);
        if (area) {
           if (!area['problems']) {
               area['problems'] = {
                   create: [],
               };
           }
           const toCreateArray = area.problems.create;
           toCreateArray.push(processedProblem);
        }
    }

    for (const area of processedAreas) {
        try {
            await prisma[modelArea].create({
                data: area,
            });
            console.log(`Successfully imported record into ${modelArea}`);
        } catch (err) {
            console.error(`Error inserting data into model ${modelArea}:`, err);
        }
    }
}

async function main() {
    const areasCsvPath = path.join(__dirname, 'data', 'area.csv');
    const problemsCsvPath = path.join(__dirname, 'data', 'problem.csv');

    await importCsvToModel(areasCsvPath, 'Area', problemsCsvPath);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
