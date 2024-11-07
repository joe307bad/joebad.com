import Link from "next/link";
import { useEffect, useState } from "react";
import "animate.css";

export default function BlogHeaderV2() {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="w-full items-end">
            <div className="pb-2 pt-4">
                <div style={{ height: 50, width: 95 }}>
                    <Link href="/">
                        <img
                            style={loaded ? {} : { display: "none" }}
                            onLoad={() => setLoaded(true)}
                            className="pb-5 animate__animated animate__fadeIn"
                            width={95}
                            src="/joe.png"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );
}
