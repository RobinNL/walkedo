const months = [
    '',
    'Januari',
    'Februari',
    'Maart',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Augustus',
    'September',
    'Oktober',
    'November',
    'December'
];

export const RenderDate = ({date, short}: { date: any; short: boolean }) => {
    const month = Number(date.toString().split('-')[1]);
    if (short) {
        return `${date.toString().split('-')[2]}-${month}-${date.toString().split('-')[0]}`
    }
    return `${date.toString().split('-')[2]} ${months[month]} ${date.toString().split('-')[0]}`
}