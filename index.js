const express = require('express');
const app = express();
const port = 5000;

const rooms = [
    {roomId: 101, numberOfSeats: 10, amenities: 'Projector, WhiteBoard', pricePerHour: 600 },
    {roomId: 102, numberOfSeats: 30, amenities: 'TV, Video Conference', pricePerHour: 1000 }
];

const bookings = [
    {bookingId:1, customerName: 'Anjel', date: '2024-8-15', startTime: '10:00', endTime: '12:00', roomId: 2},
    {bookingId:2, customerName: 'Hematha', date: '2024-8-17', startTime: '15:00', endTime:'18:00', roomId: 1}
]

app.post('/rooms', (req,res)=>{
    const {numberOfSeats, amenities, pricePerHour} = req.query;
    const newRoom = {roomId:rooms.length?rooms[rooms.length-1].roomId+1: 101, numberOfSeats,amenities,pricePerHour};
    rooms.push(newRoom);
    res.status(201).json(newRoom);
});

app.post('/bookings', (req, res)=>{
    const {customerName,date,startTime,endTime,roomId} = req.query;
    const isRoomAvailabale = !bookings.some(booked => booked.roomId === roomId && booked.date === date && !(endTime<=booked.startTime || startTime >= booked.endTime));
    if(!isRoomAvailabale) return res.status(400).json({error: 'The room is not availble'});
    const newBooking = {bookingId: bookings.length? bookings[bookings.length-1].bookingId+1 : 1, customerName,date,startTime,endTime,roomId};
    bookings.push(newBooking);
    res.status(201).json(newBooking);
});

app.get('/rooms/booked', (req,res)=>{
    const result = rooms.map((room)=>{
        const roomBookings = bookings.filter(booked => booked.roomId == room.roomId);
        return {
            ...room,
            bookedStatus: roomBookings.length >0 ? 'Booked' : 'Available',
            bookings: roomBookings
        }
    });
    res.json(result);
});

app.get('/customers',(req,res)=> {
    const result = bookings.map((booking)=>{
        const room = rooms.find(r => r.roomId == booking.roomId);
        return {
            customerName: booking.customerName,
            roomNo: booking.roomId,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime
        };
    });
    res.json(result);
});

app.get('/customers/:name',(req,res)=>{
    const {name} = req.params;
    const result = bookings.filter(booking => booking.customerName === name).map(booking =>{
        const room = rooms.find(ro=> ro.roomId === booking.roomId);
        return {
            customerName: booking.customerName,
            roomNo: booking.roomId,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
            bookingId: booking.bookingId,
            bookingDate: new Date().toISOString().split('T')[0]
            }
    });
    res.json(result);
});

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})