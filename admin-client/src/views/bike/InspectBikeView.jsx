import Map from "@/components/map/Map-component";
import { useEffect, useState } from "react";
import CityService from "services/cities";
import PieChart from "components/chart/PieChart";
import BikeSocket from "components/socket/BikeSocket";
import BikeService from "../../services/bikes";
import { useNavigate, useParams } from "react-router";
import CityDropDown from "../../components/input/CityDropDown";
import TableWithActions from "../../components/table/TableWithActions";
import style from "../../components/forms/Form.module.css";

/**
 * View a specific bike
 */
export default function InspectBikeView() {
    return <h1>BikeView</h1>
}
