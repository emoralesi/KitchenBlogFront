import { useState } from "react"

export const EmailContent = () => {

    const [data, setData] = useState([{
        titulo: "ptato tortilla",
        item: [
            "2 tomates",
            "400 gramos lentejas"
        ]
    },
    {
        titulo: "lo que sea",
        item: [
            "1/2 huevo",
            "1L leche"
        ]
    }
    ]);

    return (
        <div>
            {data?.map((value, index) => (
                <div key={index}>
                    <h1>{value.titulo}</h1>
                    <ul>
                        {value.item.map((value2, index2) => (
                            <li key={index2}>{value2}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )

}