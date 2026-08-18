# My Certificates Portfolio

A clean and simple React application to showcase professional certifications and achievements.

## 🚀 Features

- **Categorized Viewing**: Filter certificates by category (e.g., FrontEnd, BackEnd, AI) to easily navigate through different skill sets.
- **PDF Integration**: Direct access to certificate PDF documents.
- **Responsive Design**: Built with React and Bootstrap for a seamless experience across different screen sizes.

## 🛠️ Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hieu-van-nguyen/certificates.git
   cd certificates
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

To start the application in development mode:
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the site.

## 📦 Deployment

The project is configured for deployment to GitHub Pages.

To build and deploy:
```bash
npm run deploy
```

## 📁 Project Structure

- `src/data.js`: The single source of truth for certificate metadata. Update this file to add or modify certificates.
- `src/pdf/`: Contains the PDF files for each certificate.
- `public/images/`: Contains the preview images for the certificates.
- `src/App.js`: Main logic for filtering and rendering the certificates.

## 📝 Adding New Certificates

To add a new certificate to your portfolio:
1. Upload the certificate PDF to `src/pdf/`.
2. Upload a preview image to `public/images/`.
3. Add a new entry to the `menu` array in `src/data.js` following the existing format:
   ```javascript
   {
     id: 6,
     title: "Certificate-Name",
     category: "CategoryName",
     img: "/images/your-image.png",
     desc: "Short description of the certification",
     certificate: "Certificate-Name.pdf"
   }
   ```
