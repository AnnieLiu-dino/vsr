import BaseCircle from "./BaseCircle";

export default function FloorCircle() {
    return (
        <group name="floorCircle">
            <BaseCircle texture="/assets/images/circle.png" />
            <BaseCircle texture="/assets/images/circle_marker.png" />
        </group>
    );
}
