import {PrismaService} from "../prisma/prisma.service";
import {Injectable} from "@nestjs/common";

@Injectable()
export class SeedService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async seed(): Promise<void>{
        const seed = await this.prisma.seedingHistory.findFirst();

        if (!seed){
            const [role] = await Promise.all([
                this.prisma.roles.createMany({
                    data: [
                        {name: "admin", permissions: JSON.stringify(["*"])},
                        {name: "user", permissions: JSON.stringify(["can_read_user"])}
                    ]
                })
            ])
            console.log('Created roles', role)
            const [seedingHistory] = await Promise.all([
                this.prisma.seedingHistory.upsert({
                    where: { id: 1 },
                    update: { seed: true },
                    create: { seed: true },
                }),
            ]);
            console.log('Updated seeding history', seedingHistory);
        }else{
            console.log('Seeding history already exists');
        }
    }
}