document.addEventListener('DOMContentLoaded', function() {
    const emergencyBtn = document.getElementById('emergencyCallBtn');

    emergencyBtn.addEventListener('click', function() {
        const confirmed = confirm('Are you experiencing a medical emergency?\n\nClick OK to call emergency services immediately.');

        if (confirmed) {
            alert('Emergency services are being contacted.\n\nStay calm and stay on the line.');
            window.location.href = 'tel:911';
        }
    });
});

function startMeeting(doctorId) {
    const meetingUrl = `https://meet.google.com/new`;

    const doctorNames = {
        'dr-sarah-mitchell': 'Dr. Sarah Mitchell',
        'dr-james-chen': 'Dr. James Chen',
        'dr-maria-rodriguez': 'Dr. Maria Rodriguez'
    };

    const doctorName = doctorNames[doctorId] || 'the doctor';

    const confirmed = confirm(`Start video consultation with ${doctorName}?\n\nYou will be redirected to a video call.`);

    if (confirmed) {
        window.open(meetingUrl, '_blank');

        setTimeout(() => {
            alert(`Video call initiated with ${doctorName}.\n\nThe doctor will join shortly.`);
        }, 500);
    }
}