export default function maxChars(value: string, max: number): string {
    if (value.length <= max) {
        return value;
    }

    return value.substring(0, max);
}