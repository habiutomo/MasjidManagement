import { 
  users, 
  prayerSettings, 
  events, 
  announcements, 
  campaigns, 
  donations,
  type User, 
  type InsertUser,
  type PrayerSettings,
  type InsertPrayerSettings,
  type Event,
  type InsertEvent,
  type Announcement,
  type InsertAnnouncement,
  type Campaign,
  type InsertCampaign,
  type Donation,
  type InsertDonation
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Prayer Settings
  getPrayerSettings(): Promise<PrayerSettings | undefined>;
  updatePrayerSettings(settings: InsertPrayerSettings): Promise<PrayerSettings>;
  
  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Announcements
  getAnnouncements(): Promise<Announcement[]>;
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: number): Promise<boolean>;
  
  // Campaigns
  getCampaigns(): Promise<Campaign[]>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, campaign: Partial<InsertCampaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: number): Promise<boolean>;
  
  // Donations
  getDonations(): Promise<Donation[]>;
  getDonation(id: number): Promise<Donation | undefined>;
  getDonationsByCampaign(campaignId: number): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private prayerSettings: PrayerSettings | undefined;
  private events: Map<number, Event>;
  private announcements: Map<number, Announcement>;
  private campaigns: Map<number, Campaign>;
  private donations: Map<number, Donation>;
  
  private currentUserId: number;
  private currentEventId: number;
  private currentAnnouncementId: number;
  private currentCampaignId: number;
  private currentDonationId: number;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.announcements = new Map();
    this.campaigns = new Map();
    this.donations = new Map();
    
    this.currentUserId = 1;
    this.currentEventId = 1;
    this.currentAnnouncementId = 1;
    this.currentCampaignId = 1;
    this.currentDonationId = 1;
    
    // Initialize with default prayer settings
    this.prayerSettings = {
      id: 1,
      latitude: "-6.2088",
      longitude: "106.8456",
      timezone: "Asia/Jakarta",
      method: "INDONESIA_MINISTRY_OF_RELIGIOUS_AFFAIRS",
      adjustments: { fajr: 0, dhuhr: 5, asr: 0, maghrib: 3, isha: 0 },
      lastUpdated: new Date()
    };
    
    // Initialize with sample data
    this.seedSampleData();
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  // Prayer Settings
  async getPrayerSettings(): Promise<PrayerSettings | undefined> {
    return this.prayerSettings;
  }
  
  async updatePrayerSettings(settings: InsertPrayerSettings): Promise<PrayerSettings> {
    const lastUpdated = new Date();
    this.prayerSettings = { ...settings, id: 1, lastUpdated };
    return this.prayerSettings;
  }
  
  // Events
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }
  
  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }
  
  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.currentEventId++;
    const createdAt = new Date();
    const newEvent: Event = { ...event, id, createdAt };
    this.events.set(id, newEvent);
    return newEvent;
  }
  
  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined> {
    const existingEvent = this.events.get(id);
    if (!existingEvent) return undefined;
    
    const updatedEvent: Event = { ...existingEvent, ...event };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }
  
  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }
  
  // Announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values());
  }
  
  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    return this.announcements.get(id);
  }
  
  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const id = this.currentAnnouncementId++;
    const createdAt = new Date();
    const newAnnouncement: Announcement = { ...announcement, id, createdAt };
    this.announcements.set(id, newAnnouncement);
    return newAnnouncement;
  }
  
  async updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const existingAnnouncement = this.announcements.get(id);
    if (!existingAnnouncement) return undefined;
    
    const updatedAnnouncement: Announcement = { ...existingAnnouncement, ...announcement };
    this.announcements.set(id, updatedAnnouncement);
    return updatedAnnouncement;
  }
  
  async deleteAnnouncement(id: number): Promise<boolean> {
    return this.announcements.delete(id);
  }
  
  // Campaigns
  async getCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }
  
  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }
  
  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const id = this.currentCampaignId++;
    const createdAt = new Date();
    const newCampaign: Campaign = { ...campaign, id, createdAt };
    this.campaigns.set(id, newCampaign);
    return newCampaign;
  }
  
  async updateCampaign(id: number, campaign: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const existingCampaign = this.campaigns.get(id);
    if (!existingCampaign) return undefined;
    
    const updatedCampaign: Campaign = { ...existingCampaign, ...campaign };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }
  
  async deleteCampaign(id: number): Promise<boolean> {
    return this.campaigns.delete(id);
  }
  
  // Donations
  async getDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values());
  }
  
  async getDonation(id: number): Promise<Donation | undefined> {
    return this.donations.get(id);
  }
  
  async getDonationsByCampaign(campaignId: number): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(
      (donation) => donation.campaignId === campaignId,
    );
  }
  
  async createDonation(donation: InsertDonation): Promise<Donation> {
    const id = this.currentDonationId++;
    const createdAt = new Date();
    const newDonation: Donation = { ...donation, id, createdAt };
    this.donations.set(id, newDonation);
    
    // Update campaign collected amount
    const campaign = this.campaigns.get(donation.campaignId);
    if (campaign) {
      campaign.collected += donation.amount;
      this.campaigns.set(donation.campaignId, campaign);
    }
    
    return newDonation;
  }
  
  // Seed sample data for demo purposes
  private seedSampleData() {
    // Create admin user
    this.users.set(1, {
      id: 1,
      username: "admin",
      password: "admin123",
      role: "admin",
      createdAt: new Date()
    });
    this.currentUserId = 2;
    
    // Create sample events
    const events: InsertEvent[] = [
      {
        title: "Friday Prayer & Khutbah",
        description: "Imam: Sheikh Abdullah",
        eventType: "Jumu'ah",
        date: "2023-05-12",
        time: "12:30"
      },
      {
        title: "Tafsir Session",
        description: "Topic: Surah Al-Kahf",
        eventType: "Study",
        date: "2023-05-13",
        time: "19:30"
      },
      {
        title: "Community Iftar",
        description: "Open for all community members",
        eventType: "Community",
        date: "2023-05-14",
        time: "17:45"
      }
    ];
    
    events.forEach(event => {
      this.events.set(this.currentEventId, {
        ...event,
        id: this.currentEventId,
        createdAt: new Date()
      });
      this.currentEventId++;
    });
    
    // Create sample announcements
    const announcements: InsertAnnouncement[] = [
      {
        title: "Ramadan Prayer Schedule",
        content: "The Taraweeh prayers will begin at 8:30 PM throughout Ramadan. We encourage all community members to join us for these special prayers. Please bring your own prayer mats.",
        category: "Prayer",
        postedBy: "Admin",
        displayUntil: "2023-05-20"
      },
      {
        title: "Donation Drive",
        content: "We are collecting donations for the new air conditioning system. The summer heat is approaching, and we need to ensure comfortable conditions for all worshippers. Your contributions, large or small, are greatly appreciated.",
        category: "Donations",
        postedBy: "Treasurer",
        displayUntil: "2023-06-01"
      },
      {
        title: "Eid Prayer Announcement",
        content: "Eid prayer will be held at the main field adjacent to the masjid. We will have two sessions to accommodate everyone: first session at 6:30 AM and second session at 8:00 AM. Please arrive early to secure your spot.",
        category: "Events",
        postedBy: "Imam",
        displayUntil: "2023-06-15"
      }
    ];
    
    announcements.forEach(announcement => {
      this.announcements.set(this.currentAnnouncementId, {
        ...announcement,
        id: this.currentAnnouncementId,
        createdAt: new Date()
      });
      this.currentAnnouncementId++;
    });
    
    // Create sample campaigns
    const campaigns: InsertCampaign[] = [
      {
        title: "Air Conditioning System",
        description: "Help us install a new air conditioning system to keep the masjid cool during prayer times, especially for the upcoming summer months.",
        target: 50000000,
        collected: 37500000,
        endDate: "2023-06-15",
        status: "active"
      },
      {
        title: "Ramadan Food Packages",
        description: "Provide food packages for less fortunate families during Ramadan. Each package costs Rp 250,000 and contains essential items for the month.",
        target: 25000000,
        collected: 25000000,
        endDate: "2023-05-01",
        status: "completed"
      },
      {
        title: "Library Renovation",
        description: "Help us renovate and expand our masjid library with new books, shelves, and study areas for community members of all ages.",
        target: 40000000,
        collected: 12000000,
        endDate: "2023-07-30",
        status: "active"
      }
    ];
    
    campaigns.forEach(campaign => {
      this.campaigns.set(this.currentCampaignId, {
        ...campaign,
        id: this.currentCampaignId,
        createdAt: new Date()
      });
      this.currentCampaignId++;
    });
    
    // Create sample donations
    const donations: InsertDonation[] = [
      {
        campaignId: 1,
        donor: "Anonymous",
        amount: 2000000,
        isAnonymous: true,
        paymentMethod: "Bank Transfer"
      },
      {
        campaignId: 2,
        donor: "Hasan Family",
        amount: 1250000,
        isAnonymous: false,
        paymentMethod: "Bank Transfer"
      },
      {
        campaignId: 3,
        donor: "Anonymous",
        amount: 5000000,
        isAnonymous: true,
        paymentMethod: "E-wallet"
      },
      {
        campaignId: 1,
        donor: "Siti Aminah",
        amount: 500000,
        isAnonymous: false,
        paymentMethod: "Bank Transfer"
      },
      {
        campaignId: 2,
        donor: "Ahmad Family",
        amount: 2500000,
        isAnonymous: false,
        paymentMethod: "Bank Transfer"
      }
    ];
    
    donations.forEach(donation => {
      this.donations.set(this.currentDonationId, {
        ...donation,
        id: this.currentDonationId,
        createdAt: new Date()
      });
      this.currentDonationId++;
    });
  }
}

export const storage = new MemStorage();
