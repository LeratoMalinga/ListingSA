<script>
    export let icon = 'arrow_back'; // Material Icons name
  
    function goBack() {
      window.history.back();
    }
  </script>
  
  <button class="back-button" on:click={goBack}>
    <i class="material-icons">{icon}</i>
  </button>
  
  <style>
    .back-button {
      width: 30px;
      background-color: #09C5A9;
      color: white;
      border: none;
      padding: 8px;
      text-align: center;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
  
    .back-button:hover {
      background-color: #07a890;
    }
  
    .back-button i {
      font-size: 18px;
    }
  </style>
  