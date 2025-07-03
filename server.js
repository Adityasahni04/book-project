const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true); // Trust proxy for IP retrieval

// === MongoDB Connection ===
mongoose.connect('mongodb+srv://justluthra910:HJYuZNwkKndrO1uK@book-site-data.cmqfvjq.mongodb.net/?retryWrites=true&w=majority&appName=Book-site-data', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// === Schemas & Models ===
const contactSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    Subject: String,
    Message: String
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const viewSchema = new mongoose.Schema({
    ip: String,
    date: String // 'YYYY-MM-DD'
});

const Contact = mongoose.model('Contact', contactSchema);
const User = mongoose.model('User', userSchema);
const View = mongoose.model('View', viewSchema);

// === Helper to Get IP ===
function getClientIp(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '';
}

// === Routes ===

// Contact form submission
app.post('/submit-form', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(200).json({ message: "Form submitted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error submitting form", error: error.message });
    }
});

// Get all contacts
app.get('/get-contacts', async (req, res) => {
    try {
        const contacts = await Contact.find({});
        res.json(contacts);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/get-users', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Register user
app.post('/adduser', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ field: 'email', message: 'Email is already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Login user
app.post('/validateuser', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ field: 'email', message: 'Email not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ field: 'password', message: 'Incorrect password.' });
        }

        res.status(200).json({ message: 'Login successful.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

const isPrivateIP = (ip) => {
    return (
        ip.startsWith('10.') ||
        ip.startsWith('192.168.') ||
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip) ||
        ip === '127.0.0.1' ||
        ip === '::1'
    );
};

app.get('/views', async (req, res) => {
    try {
        const ip = getClientIp(req);
        const today = new Date().toISOString().split('T')[0];
        const shouldTrack = req.query.track !== 'false'; // default: true

        if (!shouldTrack) {
            const totalViews = await View.countDocuments({});
            const dailyViews = await View.countDocuments({ date: today });

            return res.status(200).json({
                message: 'View tracking disabled for this request.',
                totalViews,
                dailyViews,
                unique: false
            });
        }

        if (isPrivateIP(ip)) {
            const totalViews = await View.countDocuments({});
            const dailyViews = await View.countDocuments({ date: today });

            return res.status(200).json({
                message: 'Private IPs are not tracked.',
                totalViews,
                dailyViews,
                unique: false
            });
        }

        let alreadyViewed = await View.findOne({ ip, date: today });

        if (!alreadyViewed) {
            await new View({ ip, date: today }).save();
        }

        const totalViews = await View.countDocuments({});
        const dailyViews = await View.countDocuments({ date: today });

        res.status(200).json({
            message: alreadyViewed ? 'Already viewed today.' : 'New view counted.',
            totalViews,
            dailyViews,
            unique: !alreadyViewed
        });

        console.log(`[View] IP: ${ip}, Date: ${today}, Unique: ${!alreadyViewed}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error tracking views', error: error.message });
    }
});

// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
