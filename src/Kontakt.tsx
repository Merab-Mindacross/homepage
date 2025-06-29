import type { JSX } from "react";
import { useEffect } from "react";

/**
 * Kontakt page (German contact page)
 * - Checks for vcard=true in the search query and triggers vCard download (iPhone compatible, with image)
 * - Displays Merab's image, fully rounded
 * @returns {JSX.Element} Kontakt content
 */
export default function Kontakt(): JSX.Element {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("vcard") === "true") {
      // vCard content (iPhone compatible, with image)
      const vcard = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "FN:Merab Torodadze",
        "N:Torodadze;Merab;;;",
        "TITLE:Interim Manager",
        "ORG:Interim Management",
        "EMAIL;TYPE=INTERNET;TYPE=WORK:Tedoradze.merab@web.de",
        "TEL;TYPE=CELL:+49 177 7376989",
        // PHOTO will be inserted below
        "END:VCARD"
      ];
      // Fetch the image as base64
      fetch("/src/assets/DSC01521.jpg")
        .then(async (res) => {
          const img = document.createElement("img");
          img.src = URL.createObjectURL(await res.blob());
          img.onload = () => {
            // Create a canvas to crop/zoom the image
            const canvas = document.createElement("canvas");
            const size = 512; // vCard image size (square, large for quality)
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              // Calculate cropping: zoom in (e.g. 1.4x), focus higher (head above center)
              const zoom = 1.4;
              const srcW = img.naturalWidth / zoom;
              const srcH = img.naturalHeight / zoom;
              const srcX = (img.naturalWidth - srcW) / 2;
              // Move crop up: e.g. 30% from top
              const srcY = (img.naturalHeight - srcH) * 0.3;
              ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, size, size);
              canvas.toBlob((croppedBlob) => {
                if (!croppedBlob) return;
                const reader = new FileReader();
                reader.onloadend = () => {
                  let base64 = (reader.result as string).split(",")[1];
                  // Remove any data:image/jpeg;base64, prefix (shouldn't be present, but just in case)
                  if (base64.startsWith("data:image")) {
                    base64 = base64.substring(base64.indexOf(",") + 1);
                  }
                  // Split base64 into lines of max 75 chars (RFC 6350)
                  const base64Lines: string[] = [];
                  for (let i = 0; i < base64.length; i += 75) {
                    base64Lines.push(base64.substring(i, i + 75));
                  }
                  // Insert PHOTO property (first line with property, rest indented by a space)
                  const photoProp = [
                    "PHOTO;ENCODING=b;TYPE=JPEG:" + base64Lines[0],
                    ...base64Lines.slice(1).map((line) => " " + line)
                  ];
                  // Insert photoProp before END:VCARD
                  const vcardWithPhoto = vcard.slice(0, 6).concat(photoProp).concat(vcard.slice(6));
                  const vcardBlob = new Blob([vcardWithPhoto.join("\r\n")], { type: "text/vcard" });
                  const url = URL.createObjectURL(vcardBlob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "Merab_Torodadze.vcf";
                  document.body.appendChild(a);
                  a.click();
                  setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    // Remove vcard=true from the URL after download
                    const urlObj = new URL(window.location.href);
                    urlObj.searchParams.delete("vcard");
                    window.history.replaceState({}, document.title, urlObj.pathname + urlObj.search);
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
    <main className="min-h-screen bg-neutral-900 text-gray-100 flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full bg-neutral-800/90 rounded-2xl shadow-2xl border border-[#d6ba6d]/40 p-8 flex flex-col items-start">
        <img
          src="/src/assets/DSC01521.jpg"
          alt="Merab Torodadze Portrait"
          className="w-64 h-64 object-cover object-[50%_30%] rounded-full mb-6 border-4 border-[#d6ba6d]/60 shadow-lg mx-auto"
          style={{ display: "block" }}
        />
        <h1 className="text-3xl font-bold text-[#d6ba6d] mb-2">Kontakt</h1>
        <h2 className="text-xl font-semibold text-gray-200 mb-2">Merab Torodadze</h2>
        <div className="text-base text-[#d6ba6d] font-medium mb-2">Interim Manager</div>
        <p className="mb-4 text-lg text-gray-300">Ich begleite Unternehmen als Interim Manager mit Fokus auf Qualität, Prozesse und Lieferanten. Kontaktieren Sie mich für ein unverbindliches Gespräch.</p>
        <div className="flex flex-col gap-4 items-start">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" fill="none" stroke="#d6ba6d" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/><path d="M16 2v4H8V2"/><path d="M12 18h.01"/></svg>
            <a href="mailto:Tedoradze.merab@web.de" className="text-[#d6ba6d] text-lg font-medium hover:underline">Tedoradze.merab@web.de</a>
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
    </main>
  );
} 