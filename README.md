# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/3e543e6a-4f74-455b-8475-4937b91b77b7

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3e543e6a-4f74-455b-8475-4937b91b77b7) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Set up environment variables
cp .env.example .env
# Edit the .env file with your Supabase credentials

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (for authentication and database)

## Environment Variables

This project requires the following environment variables to be set in a `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can copy the `.env.example` file to `.env` and update it with your Supabase credentials. You can find these credentials in your Supabase project dashboard under Settings > API.

## Sound Files

This project includes all necessary sound files for meditation and ambient sounds in the `public/sounds` directory:

- Ambient sounds: rain.mp3, birds.mp3, night.mp3, ocean-waves.mp3, forest.mp3, stream.mp3, chimes.mp3, bells.mp3
- Meditation bell: meditation-bell.mp3

These files are included in the repository, so users don't need to download them separately.

You can check if all required sound files are present with:

```sh
npm run check-sounds
```

You can also use your own sound files by placing MP3 files with the same names in the `public/sounds` directory.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/3e543e6a-4f74-455b-8475-4937b91b77b7) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes it is!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
