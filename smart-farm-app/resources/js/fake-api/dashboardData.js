const dashboardData = [
    {
      id: 1,
      name: "Farm A",
      zones: [
        {
          id: 101,
          name: "Zone A1",
          sensors: [
            {
              id: 1001,
              type: "Moisture",
              latest_measure: {
                id: 5001,
                value: "30.2%",
                created_at: "2025-05-06T12:30:00Z"
              }
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Farm B",
      zones: [
        {
          id: 102,
          name: "Zone B1",
          sensors: [
            {
              id: 1002,
              type: "Temperature",
              latest_measure: {
                id: 5002,
                value: "24°C",
                created_at: "2025-05-06T12:31:00Z"
              }
            }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "Farm C",
      zones: [
        {
          id: 103,
          name: "Zone B3",
          sensors: [
            {
              id: 1002,
              type: "Temperature",
              latest_measure: {
                id: 5002,
                value: "24°C",
                created_at: "2025-05-06T12:31:00Z"
              }
            }
          ]
        }
      ]
    }
  ];
  
  export default dashboardData;
  