import { useState } from "react";


const FeatureTabs = () => {
    const [active, setActive] = useState(0)
    const images = ['/editioncrafter/editioncrafter_browser 1.png', '/editioncrafter/editioncrafter_browser 2.png', '/editioncrafter/editioncrafter_browser 3.png', '/editioncrafter/editioncrafter_browser 4.png'];
    return (
        <div className="max-w-[1072px] mx-auto">
            <img src={images[active]} width={1072} height={710} alt="EditionCrafter screenshot" className="transition" />
            <div className="md:w-full py-8 flex flex-row md:flex-col overflow-x-scroll gap-6 md:gap-12 bg-white">
                <div className="flex flex-row justify-between gap-6 md:gap-12 md:w-full">
                    <div className={`flex flex-col p-12 gap-8 w-1/2 rounded-xl min-w-80 ${ active == 0 ? 'bg-neutral' : 'hover:bg-neutral/30 cursor-pointer'} transition`} onClick={() => setActive(0)}>
                        <h3 className="text-2xl">
                            Dual-pane display
                        </h3>
                        <p className="text-neutral-gray">
                            With the dual-pane display, a scholar or reader can navigate a source text and its associated texts in several, engaging ways. The display could simply show a digital version of a manuscript or two versions of a text in parallel, such as a facsimile page and a translation. A reader could even juxtapose two pages from different parts of the manuscript or zoom into one part of a facsimile page while simultaneously viewing the full version.
                        </p>
                    </div>
                    <div className={`flex flex-col p-12 gap-8 w-1/2 rounded-xl min-w-80 ${ active == 1 ? 'bg-neutral' : 'hover:bg-neutral/30 cursor-pointer'} transition`} onClick={() => setActive(1)}>
                        <h3 className="text-2xl">
                            Supports multiple transcriptions and translations
                        </h3>
                        <p className="text-neutral-gray">
                            An edition can comprise multiple renditions of a source text, including transcriptions, normalized transcriptions, and translations. Through styling, it supports discontinuous text, inline figures, and special characters. EditionCrafter provides tools for precise transcription and translation.                        
                        </p>
                    </div>
                </div>
                <div className="flex flex-row justify-between gap-6 md:gap-12 md:w-full">
                    <div className={`flex flex-col p-12 gap-8 w-1/2 rounded-xl min-w-80 ${ active == 2 ? 'bg-neutral' : 'hover:bg-neutral/30 cursor-pointer'} transition`} onClick={() => setActive(2)}>
                        <h3 className="text-2xl">
                            Integrated commentary
                        </h3>
                        <p className="text-neutral-gray">
                            Transcriptions and translations can be annotated to mark authorial deletions and additions, to expand abbreviations, to provide brief editorial commentary, and to link to extended commentary. Readers can easily view these notes without leaving the page. Editions can also include extended resources such as interpretative essays, a glossary, and bibliography.
                        </p>
                    </div>
                    <div className={`flex flex-col p-12 gap-8 w-1/2 rounded-xl min-w-80 ${ active == 3 ? 'bg-neutral' : 'hover:bg-neutral/30 cursor-pointer'} transition`} onClick={() => setActive(3)}>
                        <h3 className="text-2xl">
                            Built on TEI and IIIF
                        </h3>
                        <p className="text-neutral-gray">
                            To create an edition, a scholar needs only to specify page breaks and image locations in a text. Editions are generated from TEI files and IIIF images, using well-established standards in the field of digital humanities.                      
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default FeatureTabs;