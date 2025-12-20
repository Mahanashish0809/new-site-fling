import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/jobs - Fetch all jobs
router.get("/", async (req, res) => {
  try {
    // Query the greenhouse_jobs table directly using raw SQL
    const jobs = await prisma.$queryRaw`
      SELECT 
        job_id as id,
        company_name as company,
        title,
        location,
        job_url as url,
        updated_at,
        description
      FROM greenhouse_jobs 
      ORDER BY updated_at DESC 
      LIMIT 100
    `;

    return res.json({ jobs: jobs || [] });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    
    // If table doesn't exist, return empty array with message
    return res.json({ jobs: [], message: "No jobs available. Run the scraper to populate jobs." });
  }
});

// GET /api/jobs/:id - Fetch single job by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const jobs = await prisma.$queryRaw`
      SELECT 
        job_id as id,
        company_name as company,
        title,
        location,
        job_url as url,
        updated_at,
        description,
        raw_data
      FROM greenhouse_jobs 
      WHERE job_id = ${parseInt(id)}
      LIMIT 1
    `;

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    return res.json({ job: jobs[0] });
  } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({ error: "Failed to fetch job" });
  }
});

export default router;

