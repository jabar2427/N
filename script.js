// Page Transition
const enterBtn = document.getElementById('enterBtn');
const landingPage = document.getElementById('landingPage');
const mainContent = document.getElementById('mainContent');

enterBtn.addEventListener('click', () => {
    landingPage.style.opacity = '0';
    setTimeout(() => {
        landingPage.style.display = 'none';
        mainContent.style.display = 'block';
        mainContent.style.opacity = '1';
    }, 300);
});

// Recording Functionality
let mediaRecorder;
let audioChunks = [];
let recordingInterval;
let seconds = 0;

const recordBtn = document.getElementById('recordBtn');
const status = document.getElementById('status');
const timer = document.getElementById('timer');
const audioPlayer = document.getElementById('audioPlayer');
const audioPlayback = document.getElementById('audioPlayback');
const downloadBtn = document.getElementById('downloadBtn');
const recordAgainBtn = document.getElementById('recordAgainBtn');

recordBtn.addEventListener('click', async () => {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            
            mediaRecorder.ondataavailable = (e) => {
                audioChunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                audioPlayback.src = audioUrl;
                audioPlayer.style.display = 'block';
                audioPlayer.style.opacity = '0';
                setTimeout(() => { audioPlayer.style.opacity = '1'; }, 100);
                
                downloadBtn.onclick = () => {
                    const a = document.createElement('a');
                    a.href = audioUrl;
                    const date = new Date().toISOString().slice(0,10);
                    a.download = `Qiro_Nadya_${date}.wav`;
                    a.click();
                };

                stream.getTracks().forEach(track => track.stop());
            };

            audioChunks = [];
            mediaRecorder.start();
            recordBtn.textContent = '⏹️ Stop Rekaman';
            recordBtn.classList.add('recording');
            status.textContent = '🔴 Sedang merekam...';
            
            seconds = 0;
            timer.textContent = '00:00';
            recordingInterval = setInterval(() => {
                seconds++;
                const mins = Math.floor(seconds / 60);
                const secs = seconds % 60;
                timer.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            }, 1000);

        } catch (err) {
            status.textContent = '❌ Tidak bisa mengakses microphone. Pastikan izin microphone sudah diberikan dan coba refresh halaman.';
            console.error('Error:', err);
        }
    } else if (mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        recordBtn.textContent = '🎤 Rekam Qiro untuk Ketua';
        recordBtn.classList.remove('recording');
        status.textContent = '✅ Rekaman selesai! Silakan dengarkan dan unduh.';
        clearInterval(recordingInterval);
        timer.textContent = '';
    }
});

recordAgainBtn.addEventListener('click', () => {
    if (confirm('Yakin ingin rekam ulang? Rekaman sebelumnya akan hilang.')) {
        audioPlayer.style.opacity = '0';
        setTimeout(() => {
            audioPlayer.style.display = 'none';
            audioChunks = [];
            status.textContent = '';
            timer.textContent = '';
        }, 300);
    }
});