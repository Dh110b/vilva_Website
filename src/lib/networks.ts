export type NetworkEntry = {
  id: string;
  area: string;
  name: string;
  address: string;
};

// Seed data used the first time the network list is loaded.
export const DEFAULT_NETWORKS: NetworkEntry[] = [
  {
    id: "dharmapuri",
    area: "DHARMAPURI",
    name: "M/s.SHASHANTH ENTERPRISES",
    address: "#107,D.ANNASAGARAM ROAD, BHARATHIPURAM,DHARMAPURI-636705",
  },
  {
    id: "trichy",
    area: "TRICHY",
    name: "M/s.SRI SASTHA RO",
    address: "MOOGAMBIKAI NAGAR, MLS PLAZA, M.K.KOTTAI,TRICHY-11",
  },
  {
    id: "kaveripatnam",
    area: "KAVERIPATNAM",
    name: "M/s.DN ENTERPRISES",
    address: "THERPATTI VILLAGE. THEMMAPURAM POST KAVERIPATNAM-635112 KRISHNAGIRI DIST.",
  },
];
