# Hotel Room Reservation System

A dynamic hotel room reservation system that optimally assigns rooms based on travel time minimization. The system visualizes a 10-floor hotel with 97 rooms and implements intelligent booking algorithms.

## Features

### 🏨 Hotel Structure
- **10 Floors** with 97 total rooms
- **Floors 1-9**: 10 rooms each (101-110, 201-210, etc.)
- **Floor 10**: 7 rooms (1001-1007)
- **Staircase/Lift**: Located on the left side of the building

### 🎯 Booking Algorithm
- **Priority 1**: Book rooms on the same floor first
- **Priority 2**: Minimize total travel time between rooms
- **Travel Time Calculation**:
  - Horizontal: 1 minute per room
  - Vertical: 2 minutes per floor
- **Maximum Booking**: 5 rooms per guest

### 🎨 User Interface
- **Input Field**: Specify number of rooms (1-5)
- **Book Button**: Reserve optimal rooms
- **Reset Button**: Clear all bookings
- **Random Button**: Generate random room occupancy
- **Visual Layout**: Interactive hotel floor plan
- **Real-time Stats**: Room availability counters
- **Booking Confirmation**: Shows assigned rooms and travel time

### 🎨 Visual Features
- **Color-coded Rooms**:
  - 🟢 Green: Available
  - 🔴 Red: Booked
  - 🟡 Yellow: Occupied
- **Interactive Tooltips**: Hover for room details
- **Responsive Design**: Works on desktop and mobile
- **Modern UI**: Gradient backgrounds and smooth animations

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- pnpm (recommended) or npm

### Installation

1. **Clone or download the project**
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
   or
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   pnpm dev
   ```
   or
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`
   **Deployed Link**-`https://hotel-reservation-system-inky.vercel.app/`
### Build for Production
```bash
pnpm build
```

## How to Use

1. **Enter the number of rooms** you want to book (1-5)
2. **Click "Book"** to reserve optimal rooms
3. **View the booking confirmation** with room numbers and travel time
4. **Use "Random"** to simulate hotel occupancy
5. **Use "Reset"** to clear all bookings

## Algorithm Details

### Room Assignment Logic
1. **Same Floor Priority**: System first tries to find consecutive rooms on the same floor
2. **Travel Time Optimization**: If same-floor booking isn't possible, it finds the combination with minimum travel time
3. **Multi-floor Assignment**: When spanning floors, it considers both vertical and horizontal travel costs

### Example Scenarios
- **Scenario 1**: Booking 4 rooms when Floor 1 has rooms 101, 102, 105, 106 available
  - Result: Rooms 101, 102, 105, 106 (same floor, minimal travel time)
- **Scenario 2**: Booking 2 rooms when only 101, 102 available on Floor 1
  - Result: Rooms 201, 202 on Floor 2 (minimal vertical + horizontal travel)

## Technical Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: CSS3 with modern gradients and animations
- **State Management**: React Hooks (useState, useEffect)

## Project Structure

```
hotel-reservation-system/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## Live Demo

The application provides a complete hotel reservation experience with:
- ✅ Dynamic room visualization
- ✅ Optimal booking algorithm
- ✅ Travel time calculation
- ✅ Interactive controls
- ✅ Real-time statistics
- ✅ Responsive design

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
