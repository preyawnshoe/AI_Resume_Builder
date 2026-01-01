# AI Resume Builder

An intelligent resume builder application powered by OpenAI that helps users create professional, ATS-optimized resumes with AI-driven suggestions and multiple customizable templates.

## Features

- **AI-Powered Content Generation**: Get intelligent suggestions for resume content using OpenAI
- **Multiple Professional Templates**: Choose from various professionally designed resume templates
- **Customizable Color Themes**: Personalize your resume with different color schemes
- **Real-time Preview**: See changes instantly as you build your resume
- **Export Options**: Download your resume as PDF
- **Profile Image Upload**: Add a professional photo to your resume
- **Section Management**: Easily add, edit, and reorder resume sections
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) (React 18)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **AI Integration**: [OpenAI API](https://openai.com/api)
- **PDF Generation**: [@react-pdf/renderer](https://react-pdf.org)
- **Print Functionality**: [react-to-print](https://github.com/gregnb/react-to-print)
- **Icons**: [@heroicons/react](https://heroicons.com)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun package manager
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/preyawnshoe/AI_Resume_Builder.git
cd resume_builder
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
resume_builder/
├── components/          # Reusable React components
│   └── ResumeTemplate.js
├── pages/              # Next.js pages
│   ├── index.js        # Home page
│   ├── create-resume/  # Resume creation page
│   ├── view-resume/    # Resume preview and export
│   ├── ai-suggestions/ # AI suggestions page
│   └── api/            # API routes
├── public/             # Static assets
├── styles/             # Global styles
└── package.json        # Project dependencies
```

## Usage

1. **Create Resume**: Navigate to the create resume page and fill in your information
2. **AI Suggestions**: Use the AI suggestions feature to get intelligent content recommendations
3. **Customize**: Choose a template and color theme that matches your style
4. **Preview**: View your resume in real-time as you make changes
5. **Download**: Export your completed resume as a PDF

## API Routes

- `/api/ai-suggestions` - Generate AI-powered resume content suggestions
- Additional API routes can be added in the `pages/api` directory

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## Environment Variables

Create a `.env.local` file with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is part of the Impact Hiring initiative.

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Utility-first CSS framework
- [OpenAI API Documentation](https://platform.openai.com/docs) - AI integration guide
- [React PDF Documentation](https://react-pdf.org/) - PDF generation in React

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

## Support

For questions or issues, please open an issue in the GitHub repository.
