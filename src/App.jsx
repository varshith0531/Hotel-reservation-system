import React, { useState, useEffect } from 'react';

const App = () => {
  const [rooms, setRooms] = useState({});
  const [numRooms, setNumRooms] = useState(1);
  const [bookingInfo, setBookingInfo] = useState(null);

  // Initialize hotel structure
  useEffect(() => {
    initializeHotel();
  }, []);

  const initializeHotel = () => {
    const hotelRooms = {};
    
    // Floors 1-9: 10 rooms each (101-110, 201-210, etc.)
    for (let floor = 1; floor <= 9; floor++) {
      for (let room = 1; room <= 10; room++) {
        const roomNumber = floor * 100 + room;
        hotelRooms[roomNumber] = {
          number: roomNumber,
          floor: floor,
          position: room,
          status: 'available', // available, booked, occupied
          bookingId: null
        };
      }
    }
    
    // Floor 10: 7 rooms (1001-1007)
    for (let room = 1; room <= 7; room++) {
      const roomNumber = 1000 + room;
      hotelRooms[roomNumber] = {
        number: roomNumber,
        floor: 10,
        position: room,
        status: 'available',
        bookingId: null
      };
    }
    
    setRooms(hotelRooms);
  };

  // Calculate travel time between two rooms
  const calculateTravelTime = (room1, room2) => {
    const floorDiff = Math.abs(room1.floor - room2.floor);
    const horizontalDiff = Math.abs(room1.position - room2.position);
    
    const verticalTime = floorDiff * 2; // 2 minutes per floor
    const horizontalTime = horizontalDiff * 1; // 1 minute per room
    
    return verticalTime + horizontalTime;
  };

  // Calculate total travel time for a set of rooms
  const calculateTotalTravelTime = (roomNumbers) => {
    if (roomNumbers.length <= 1) return 0;
    
    const roomObjects = roomNumbers.map(num => rooms[num]);
    let totalTime = 0;
    
    for (let i = 0; i < roomObjects.length - 1; i++) {
      totalTime += calculateTravelTime(roomObjects[i], roomObjects[i + 1]);
    }
    
    return totalTime;
  };

  // Find optimal room assignment
  const findOptimalRooms = (numRoomsToBook) => {
    const availableRooms = Object.values(rooms).filter(room => room.status === 'available');
    
    if (availableRooms.length < numRoomsToBook) {
      return null; // Not enough rooms available
    }

    // Group rooms by floor
    const roomsByFloor = {};
    availableRooms.forEach(room => {
      if (!roomsByFloor[room.floor]) {
        roomsByFloor[room.floor] = [];
      }
      roomsByFloor[room.floor].push(room);
    });

    // Sort rooms within each floor by position
    Object.keys(roomsByFloor).forEach(floor => {
      roomsByFloor[floor].sort((a, b) => a.position - b.position);
    });

    let bestAssignment = null;
    let bestTravelTime = Infinity;

    // Try to find rooms on the same floor first
    for (const floor in roomsByFloor) {
      const floorRooms = roomsByFloor[floor];
      if (floorRooms.length >= numRoomsToBook) {
        // Try all possible consecutive combinations on this floor
        for (let i = 0; i <= floorRooms.length - numRoomsToBook; i++) {
          const candidateRooms = floorRooms.slice(i, i + numRoomsToBook);
          const travelTime = calculateTotalTravelTime(candidateRooms.map(r => r.number));
          
          if (travelTime < bestTravelTime) {
            bestTravelTime = travelTime;
            bestAssignment = candidateRooms.map(r => r.number);
          }
        }
      }
    }

    // If no single floor solution, try multi-floor combinations
    if (!bestAssignment) {
      const allCombinations = generateCombinations(availableRooms, numRoomsToBook);
      
      for (const combination of allCombinations) {
        const travelTime = calculateTotalTravelTime(combination.map(r => r.number));
        if (travelTime < bestTravelTime) {
          bestTravelTime = travelTime;
          bestAssignment = combination.map(r => r.number);
        }
      }
    }

    return {
      rooms: bestAssignment,
      travelTime: bestTravelTime
    };
  };

  // Generate combinations of rooms (for multi-floor assignments)
  const generateCombinations = (rooms, size) => {
    if (size === 1) return rooms.map(room => [room]);
    
    const combinations = [];
    for (let i = 0; i <= rooms.length - size; i++) {
      const head = rooms[i];
      const tailCombinations = generateCombinations(rooms.slice(i + 1), size - 1);
      tailCombinations.forEach(combination => {
        combinations.push([head, ...combination]);
      });
    }
    return combinations;
  };

  // Book rooms
  const handleBook = () => {
    if (numRooms < 1 || numRooms > 5) {
      alert('Please enter a number between 1 and 5');
      return;
    }

    const optimalAssignment = findOptimalRooms(numRooms);
    
    if (!optimalAssignment) {
      alert('Not enough rooms available for booking');
      return;
    }

    const bookingId = Date.now();
    const updatedRooms = { ...rooms };
    
    optimalAssignment.rooms.forEach(roomNumber => {
      updatedRooms[roomNumber] = {
        ...updatedRooms[roomNumber],
        status: 'booked',
        bookingId: bookingId
      };
    });

    setRooms(updatedRooms);
    setBookingInfo({
      rooms: optimalAssignment.rooms,
      travelTime: optimalAssignment.travelTime,
      bookingId: bookingId
    });
  };

  // Reset all bookings
  const handleReset = () => {
    const updatedRooms = { ...rooms };
    Object.keys(updatedRooms).forEach(roomNumber => {
      updatedRooms[roomNumber] = {
        ...updatedRooms[roomNumber],
        status: 'available',
        bookingId: null
      };
    });
    
    setRooms(updatedRooms);
    setBookingInfo(null);
  };

  // Generate random occupancy
  const handleRandom = () => {
    const updatedRooms = { ...rooms };
    const roomNumbers = Object.keys(updatedRooms);
    
    // Randomly occupy 20-40% of rooms
    const numToOccupy = Math.floor(Math.random() * (roomNumbers.length * 0.2) + roomNumbers.length * 0.2);
    const shuffledRooms = roomNumbers.sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < numToOccupy; i++) {
      const roomNumber = shuffledRooms[i];
      updatedRooms[roomNumber] = {
        ...updatedRooms[roomNumber],
        status: 'occupied',
        bookingId: null
      };
    }
    
    setRooms(updatedRooms);
    setBookingInfo(null);
  };

  // Get room status counts
  const getStats = () => {
    const roomValues = Object.values(rooms);
    return {
      total: roomValues.length,
      available: roomValues.filter(room => room.status === 'available').length,
      booked: roomValues.filter(room => room.status === 'booked').length,
      occupied: roomValues.filter(room => room.status === 'occupied').length
    };
  };

  const stats = getStats();

  return (
    <div className="container">
      <div className="header">
        <h1>Hotel Room Reservation System</h1>
        <p>Optimal room assignment based on travel time minimization</p>
      </div>

      <div className="controls">
        <div className="control-group">
          <label htmlFor="numRooms">No of Rooms:</label>
          <input
            type="number"
            id="numRooms"
            min="1"
            max="5"
            value={numRooms}
            onChange={(e) => setNumRooms(parseInt(e.target.value) || 1)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleBook}>
          Book
        </button>
        <button className="btn btn-warning" onClick={handleReset}>
          Reset
        </button>
        <button className="btn btn-secondary" onClick={handleRandom}>
          Random
        </button>
      </div>

      <div className="hotel-layout">
        <div className="hotel-container">
          <div className="staircase">
            STAIRS & LIFT
          </div>
          <div className="rooms-container">
            {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(floor => (
              <div key={floor} className="floor">
                <div className="floor-label">Floor {floor}</div>
                <div className="rooms-row">
                  {floor === 10 ? (
                    // Floor 10 has only 7 rooms
                    Array.from({ length: 7 }, (_, i) => {
                      const roomNumber = 1000 + i + 1;
                      const room = rooms[roomNumber];
                      return (
                        <div
                          key={roomNumber}
                          className={`room ${room?.status || 'available'}`}
                          title={`Room ${roomNumber} - ${room?.status || 'available'}`}
                        >
                          {roomNumber}
                          <div className="room-tooltip">
                            Room {roomNumber}<br/>
                            Status: {room?.status || 'available'}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    // Floors 1-9 have 10 rooms each
                    Array.from({ length: 10 }, (_, i) => {
                      const roomNumber = floor * 100 + i + 1;
                      const room = rooms[roomNumber];
                      return (
                        <div
                          key={roomNumber}
                          className={`room ${room?.status || 'available'}`}
                          title={`Room ${roomNumber} - ${room?.status || 'available'}`}
                        >
                          {roomNumber}
                          <div className="room-tooltip">
                            Room {roomNumber}<br/>
                            Status: {room?.status || 'available'}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="stats">
        <div className="stat-item">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Rooms</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.available}</div>
          <div className="stat-label">Available</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.booked}</div>
          <div className="stat-label">Booked</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{stats.occupied}</div>
          <div className="stat-label">Occupied</div>
        </div>
      </div>

      {bookingInfo && (
        <div className="booking-info">
          <h3>Booking Confirmed!</h3>
          <p>
            <strong>Rooms Booked:</strong> {bookingInfo.rooms.join(', ')}<br/>
            <strong>Total Travel Time:</strong> {bookingInfo.travelTime} minutes<br/>
            <strong>Booking ID:</strong> {bookingInfo.bookingId}
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
