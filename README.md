
# Team Name:
Mind Bloom 

# Team Members:
1. Guruvishnu Kurra  
2. Ayush Tripathi
3. Akash Patil
4. Chinmay Kulkarni
5. Siddhi Jambhale

# Project Name:
Mind Bloom – Compass for Wellbeing

# Project Abstract:
Mind Bloom is a mental wellness platform designed to promote emotional health, self-awareness, and mindfulness among individuals. It combines AI-powered interactions with mood tracking and habit-building tools to help users manage stress, anxiety, and everyday mental challenges. The platform provides a safe, stigma-free digital space for self-reflection, learning, and guided improvement in mental wellbeing.  

Using Supabase for authentication and data storage, the app ensures secure handling of user information. An AI-powered assistant (integrated via OpenAI API) helps users with personalized wellness advice and journaling prompts. The intuitive and responsive interface is built with React, Tailwind CSS, and shadcn-ui for a modern, engaging user experience.

# Tech Stack:
- **Frontend:** React.js, TypeScript, Vite  
- **UI / Styling:** Tailwind CSS, shadcn-ui  
- **Backend / Database:** Supabase  
- **AI / NLP:** OpenAI API  
- **Hosting / Deployment:** Vercel  

# Dataset Used (if any):
No external dataset was used. The application relies on real-time user input and API-based responses from OpenAI for personalized interactions.








# Mind Bloom / Compass Wellbeing 🌱

Millions struggle in silence—our mission is to create an accessible, stigma-free platform that empowers everyone to take charge of their mental well-being.  
Live demo: [mind-bloom-compass-wellbeing.vercel.app](https://mind-bloom-compass-wellbeing.vercel.app)  

---

## 🧠 About

Mind Bloom is a mental wellness platform combining **AI**, **community features**, and **resource tools** to support emotional health. It aims to reduce stigma, provide intelligent guidance, and be a safe space for people seeking well-being support.

---

## ✨ Features

- AI Wellbeing Assistant (powered by OpenAI) for mental health advice & prompts  
- Authentication & database using Supabase  
- Structured UI with **shadcn-ui**, **Tailwind CSS**, and **React + TypeScript**  
- Responsive, clean frontend built with Vite  
- Environment-based configuration (using `.env` / `.env.example`)  
- (Optional) Future: journaling, mood tracking, community boards, etc.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| UI / Styling | shadcn-ui, Tailwind CSS |
| Backend / Auth / DB | Supabase |
| AI / NLP | OpenAI API |
| Deployment | Vercel (or similar) |

---

## 🚀 Setup / Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/Guruvishnukurra/mind-bloom-compass-wellbeing.git
   cd mind-bloom-compass-wellbeing
Install dependencies

npm install
# or `yarn` if you prefer


Set up environment variables

Copy .env.example to .env

Populate with your credentials:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key


Run development server

npm run dev


Open in browser
It should launch at http://localhost:3000 (or whichever port Vite assigns).

⛓ Environment Variables / Secrets

You’ll need the following keys (fill these in .env):

VITE_SUPABASE_URL

VITE_SUPABASE_ANON_KEY

VITE_OPENAI_API_KEY

⚠️ Security Tip: Never commit your real .env file — only .env.example. Make sure .gitignore covers .env.

📈 Deployment

This project is optimized for deployment on platforms like Vercel.
Just connect your GitHub repo, set the environment variables in the deployment config, and push to main (or your main branch). Vercel will handle builds and hosting.

Optionally, you can also connect a custom domain in your deployment settings.

🚧 Roadmap / Future Work

Add mood tracking & journaling

Community forums or peer support boards

Push notifications & reminders

Better analytics & usage dashboards

Mobile app version or PWA support

💡 Contributing

Fork the repo

Create a feature branch: git checkout -b feature/YourFeature

Make changes & commit: git commit -m "Add your feature"

Push: git push origin feature/YourFeature

Open a Pull Request — describe what you changed & why

Before contributing, please check [issues] or open a new issue for discussion.

📄 License

Specify your license here (e.g. MIT, Apache 2.0, etc.)

🏷️ Acknowledgments

Built using Supabase

Uses OpenAI API for AI features

UI powered by shadcn-ui + Tailwind CSS

Inspired by the need for destigmatizing mental health and building accessible tools

📞 Contact

If you want to reach out:

GitHub: @Guruvishnukurra

(Optional) Email / Twitter / etc.


