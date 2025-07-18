import type { JSX } from "react";
import { useEffect, useRef } from "react";
import Footer from "./components/Footer";

/**
 * Kontakt page (German contact page)
 * - Checks for vcard=true in the search query and triggers vCard download (iPhone compatible, with image)
 * - Displays Merab's image, fully rounded
 * @returns {JSX.Element} Kontakt content
 */
export default function Kontakt(): JSX.Element {
  // Prevent double vCard download
  const downloadInProgress = useRef(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("vcard") === "true" && !downloadInProgress.current) {
      downloadInProgress.current = true;
      // vCard content (iPhone compatible, with image)
      const vcard = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "FN:Merab Tedoradze",
        "N:Tedoradze;Merab;;;",
        "ORG:Mindacross",
        "EMAIL;TYPE=INTERNET;TYPE=WORK:merab.tedoradze@mindacross.de",
        "TEL;TYPE=CELL:+49 177 7376989",
        // PHOTO will be inserted below
        "END:VCARD"
      ];
      // Fetch the image as base64
      fetch("/DSC01521.jpg")
        .then(async (res) => {
          const img = document.createElement("img");
          img.src = URL.createObjectURL(await res.blob());
          img.onload = () => {
            // Create a canvas to crop/zoom the image (keep aspect ratio, crop to square, focus top center)
            const size = 512; // vCard image size (square)
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              // Calculate cropping: crop to square, focus on top center
              const minDim = Math.min(img.naturalWidth, img.naturalHeight);
              const cropWidth = minDim;
              const cropHeight = minDim;
              const cropX = (img.naturalWidth - cropWidth) / 2;
              // Move crop up: start a bit higher (e.g. 10% from top)
              const cropY = Math.max(0, (img.naturalHeight - cropHeight) * 0.1);
              ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, size, size);
              canvas.toBlob((croppedBlob) => {
                if (!croppedBlob) return;
                const reader = new FileReader();
                reader.onloadend = () => {
                  let base64 = (reader.result as string).split(",")[1];
                  if (base64.startsWith("data:image")) {
                    base64 = base64.substring(base64.indexOf(",") + 1);
                  }
                  const base64Lines: string[] = [];
                  for (let i = 0; i < base64.length; i += 75) {
                    base64Lines.push(base64.substring(i, i + 75));
                  }
                  const photoProp = [
                    "PHOTO;ENCODING=b;TYPE=JPEG:" + base64Lines[0],
                    ...base64Lines.slice(1).map((line) => " " + line)
                  ];
                  const vcardWithPhoto = vcard.slice(0, 6).concat(photoProp).concat(vcard.slice(6));
                  const vcardBlob = new Blob([vcardWithPhoto.join("\r\n")], { type: "text/vcard" });
                  const url = URL.createObjectURL(vcardBlob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "Merab_Tedoradze.vcf";
                  document.body.appendChild(a);
                  a.click();
                  setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    const urlObj = new URL(window.location.href);
                    urlObj.searchParams.delete("vcard");
                    window.history.replaceState({}, document.title, urlObj.pathname + urlObj.search);
                    downloadInProgress.current = false;
                  }, 100);
                };
                reader.readAsDataURL(croppedBlob);
              }, "image/jpeg", 0.92);
            }
          };
        });
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col justify-between bg-neutral-900 text-gray-100 px-4 py-0 md:pt-36">
      <div className="mx-auto mt-16 max-w-xl w-full flex flex-col items-start mb-12">
        <img
          src="/DSC01521.jpg"
          alt="Merab Tedoradze Portrait"
          className="w-64 h-64 object-cover object-[50%_30%] rounded-full mb-6 border-4 border-[#d6ba6d]/60 shadow-lg mx-auto"
          style={{ display: "block" }}
        />
        <h1 className="text-3xl font-bold text-[#d6ba6d] mb-2">Kontakt</h1>
        <h2 className="text-xl font-semibold text-gray-200 mb-2">Merab Tedoradze</h2>
        <div className="text-base text-[#d6ba6d] font-medium mb-2">Interim Manager</div>
        <p className="mb-4 text-lg text-gray-300">Ich begleite Unternehmen als Interim Manager mit Fokus auf Qualität, Prozesse und Lieferanten. Kontaktieren Sie mich für ein unverbindliches Gespräch.</p>
        <div className="flex flex-col gap-4 items-start">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" fill="none" stroke="#d6ba6d" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/><path d="M16 2v4H8V2"/><path d="M12 18h.01"/></svg>
            <a href="mailto:merab.tedoradze@mindacross.de" className="text-[#d6ba6d] text-lg font-medium hover:underline">merab.tedoradze@mindacross.de</a>
          </div>
          <div className="flex items-center gap-3">
            <svg width="24" height="24" fill="none" stroke="#d6ba6d" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 21 16.91z"/></svg>
            <a href="tel:+491777376989" className="text-[#d6ba6d] text-lg font-medium hover:underline">+49 177 7376989</a>
          </div>

        </div>
        <a
          href="?vcard=true"
          className="mt-8 inline-block px-6 py-3 rounded-full bg-[#d6ba6d] text-neutral-900 font-bold text-base shadow-lg hover:bg-[#e7c97a] focus:outline-none focus:ring-2 focus:ring-[#d6ba6d] focus:ring-offset-2 transition-colors duration-200"
          style={{ alignSelf: "flex-start" }}
        >
          vCard herunterladen
        </a>
      </div>
      <Footer />
    </main>
  );
} 