export interface IconProps {
    name: string;
    width: string;
    className?: string;
    height: string;
}

export const Icon = (props: IconProps) => {

    return (
        <svg className={props.className} style={{ width: props.width, height: props.height }}>
            <use href={`/icons/sprite.svg#${props.name?.toUpperCase()}`}></use>
        </svg>
    )

}