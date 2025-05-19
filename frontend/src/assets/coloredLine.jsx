const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: '5rem',
            width: '450rem',
            margin: '0 auto',
        }}
    />
);

export default ColoredLine;