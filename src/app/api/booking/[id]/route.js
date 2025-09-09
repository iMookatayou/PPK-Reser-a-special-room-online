export async function GET(req, { params }) {
  const { id } = params

  const mockBookings = {
    '1234567890123': {
      fullName: 'Johe Doe',
      building: 'KongKiat Dome',
      status: 'กำลังตรวจสอบ', // สามารถเปลี่ยนเป็น "ได้ห้องแล้ว" ฯลฯ ได้
    },
  }

  const result = mockBookings[id]

  if (result) {
    return Response.json(result)
  } else {
    return new Response(JSON.stringify({ error: 'ไม่พบข้อมูล' }), { status: 404 })
  }
}
