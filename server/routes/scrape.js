import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/save", async (req, res) => {
    try {
        const { jobs } = req.body;

        if (!jobs || jobs.length === 0) {
            return res.status(400).json({ message: "No jobs provided" });
        }

        let saved = 0;

        for (const job of jobs) {
            try {
                await prisma.jobs.upsert({
                    where: { job_url: job.url },
                    update: {},
                    create: {
                        company_name: job.company_name || null,
                        title: job.title,
                        location: job.location || null,
                        job_url: job.url,
                        posted_on: job.posted_on ? new Date(job.posted_on) : null,
                        source: job.source || "workday",
                        raw_data: job
                    }
                });

                saved++;
            } catch (err) {
                console.log("Duplicate skipped:", job.url);
            }
        }

        return res.json({ message: "Jobs saved", count: saved });

    } catch (error) {
        console.error("Error saving jobs:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
