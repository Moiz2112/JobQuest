import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Default admin credentials
        const adminEmail = 'admin@jobquest.com';
        const adminPassword = 'Admin123456';
        const adminFullname = 'Platform Admin';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('✓ Admin user already exists with email:', adminEmail);
            await mongoose.connection.close();
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Create admin user
        const adminUser = await User.create({
            fullname: adminFullname,
            email: adminEmail,
            phoneNumber: '+1-800-ADMIN-00',
            password: hashedPassword,
            role: 'admin',
            profile: {
                profilePhoto: '',
                headline: 'Platform Administrator'
            }
        });

        console.log('✓ Admin user created successfully!');
        console.log('\n📧 Admin Login Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`Email:    ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\nLogin URL: http://localhost:5174/admin-login');
        console.log('Dashboard URL: http://localhost:5174/admin');

        await mongoose.connection.close();
        console.log('\n✓ Database connection closed');
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdminUser();
