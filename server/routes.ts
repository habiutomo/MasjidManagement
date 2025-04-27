import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertPrayerSettingsSchema, 
  insertEventSchema, 
  insertAnnouncementSchema, 
  insertCampaignSchema, 
  insertDonationSchema
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();
  
  // Middleware to handle validation errors
  function validateRequest(schema: any) {
    return (req: Request, res: Response, next: any) => {
      try {
        schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).json({ error: error.errors });
        } else {
          res.status(500).json({ error: "Internal server error" });
        }
      }
    };
  }

  // User routes
  router.post("/users", validateRequest(insertUserSchema), async (req, res) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      const user = await storage.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Prayer Settings routes
  router.get("/prayer-settings", async (req, res) => {
    try {
      const settings = await storage.getPrayerSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to get prayer settings" });
    }
  });

  router.put("/prayer-settings", validateRequest(insertPrayerSettingsSchema), async (req, res) => {
    try {
      const settings = await storage.updatePrayerSettings(req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update prayer settings" });
    }
  });

  // Event routes
  router.get("/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to get events" });
    }
  });

  router.get("/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(parseInt(req.params.id));
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to get event" });
    }
  });

  router.post("/events", validateRequest(insertEventSchema), async (req, res) => {
    try {
      const event = await storage.createEvent(req.body);
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  router.put("/events/:id", async (req, res) => {
    try {
      const event = await storage.updateEvent(parseInt(req.params.id), req.body);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to update event" });
    }
  });

  router.delete("/events/:id", async (req, res) => {
    try {
      const success = await storage.deleteEvent(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  // Announcement routes
  router.get("/announcements", async (req, res) => {
    try {
      const announcements = await storage.getAnnouncements();
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ error: "Failed to get announcements" });
    }
  });

  router.get("/announcements/:id", async (req, res) => {
    try {
      const announcement = await storage.getAnnouncement(parseInt(req.params.id));
      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error) {
      res.status(500).json({ error: "Failed to get announcement" });
    }
  });

  router.post("/announcements", validateRequest(insertAnnouncementSchema), async (req, res) => {
    try {
      const announcement = await storage.createAnnouncement(req.body);
      res.status(201).json(announcement);
    } catch (error) {
      res.status(500).json({ error: "Failed to create announcement" });
    }
  });

  router.put("/announcements/:id", async (req, res) => {
    try {
      const announcement = await storage.updateAnnouncement(parseInt(req.params.id), req.body);
      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error) {
      res.status(500).json({ error: "Failed to update announcement" });
    }
  });

  router.delete("/announcements/:id", async (req, res) => {
    try {
      const success = await storage.deleteAnnouncement(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete announcement" });
    }
  });

  // Campaign routes
  router.get("/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ error: "Failed to get campaigns" });
    }
  });

  router.get("/campaigns/:id", async (req, res) => {
    try {
      const campaign = await storage.getCampaign(parseInt(req.params.id));
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: "Failed to get campaign" });
    }
  });

  router.post("/campaigns", validateRequest(insertCampaignSchema), async (req, res) => {
    try {
      const campaign = await storage.createCampaign(req.body);
      res.status(201).json(campaign);
    } catch (error) {
      res.status(500).json({ error: "Failed to create campaign" });
    }
  });

  router.put("/campaigns/:id", async (req, res) => {
    try {
      const campaign = await storage.updateCampaign(parseInt(req.params.id), req.body);
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: "Failed to update campaign" });
    }
  });

  router.delete("/campaigns/:id", async (req, res) => {
    try {
      const success = await storage.deleteCampaign(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete campaign" });
    }
  });

  // Donation routes
  router.get("/donations", async (req, res) => {
    try {
      const donations = await storage.getDonations();
      res.json(donations);
    } catch (error) {
      res.status(500).json({ error: "Failed to get donations" });
    }
  });

  router.get("/donations/campaign/:campaignId", async (req, res) => {
    try {
      const donations = await storage.getDonationsByCampaign(parseInt(req.params.campaignId));
      res.json(donations);
    } catch (error) {
      res.status(500).json({ error: "Failed to get donations for campaign" });
    }
  });

  router.post("/donations", validateRequest(insertDonationSchema), async (req, res) => {
    try {
      const campaign = await storage.getCampaign(req.body.campaignId);
      if (!campaign) {
        return res.status(400).json({ error: "Campaign not found" });
      }
      
      if (campaign.status !== "active") {
        return res.status(400).json({ error: "Cannot donate to inactive campaign" });
      }
      
      const donation = await storage.createDonation(req.body);
      res.status(201).json(donation);
    } catch (error) {
      res.status(500).json({ error: "Failed to create donation" });
    }
  });

  // Register routes
  app.use("/api", router);

  const httpServer = createServer(app);
  return httpServer;
}
