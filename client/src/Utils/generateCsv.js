function flattenObject(obj, parentKey = '', res = {}) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const propName = parentKey ? `${parentKey}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                flattenObject(obj[key], propName, res);
            } else {
                res[propName] = obj[key];
            }
        }
    }
    return res;
}

function generateExcel(data, filename = "data") {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Flatten the data
    const flattenedData = data.map(row => flattenObject(row));

    // Add header row
    const headerRow = Object.keys(flattenedData[0]);
    csvContent += headerRow.join(",") + "\n";

    // Add data rows
    flattenedData.forEach((row) => {
        const values = headerRow.map(header => {
            let value = row[header];
            if (typeof value === "string" && value.startsWith("http")) {
                return `"${value}"`;
            }
            return value !== undefined ? value : '';
        });
        csvContent += values.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export default generateExcel;
