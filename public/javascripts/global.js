var simulatorData = [];

$(document).ready(function() {
  populateTable();
});

// (Note to self) a.linkshowinfo -> corresponds to the href url below
$('#simulatorList table tbody').on('click', 'td a.linkshowinfo', showSimulatorInfo);
$('#simulatorList table tbody').on('click', 'td a.linkdeletesimulator', deleteSimulator);
$('#btnAddSimulator').on('click', addSimulator);

function populateTable() {
  var tableContent = '';
  // jQuery Ajax from JSON
  $.getJSON('/simulators/simulatorlist', function(data) {
    // sticking the entire result from the database
    // from its first access. This is NOT a good idea
    // for large-scale systems.
    simulatorData = data;
    $.each(data, function() {
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowinfo" rel="' + this.simulatorname + '">' + this.simulatorname + '</a></td>';
      tableContent += '<td><a href="simulators/' + this.simulatorname + '">simulate</a></td>';
      tableContent += '<td><a href="#" class="linkdeletesimulator" rel="' + this._id + '">remove</a></td>';
      tableContent += '</tr>';
    });

    $('#tbody').html(tableContent);
  });
};

function showSimulatorInfo(event) {
  event.preventDefault();

  var thisSimName = $(this).attr('rel');
  var arrayIdx = simulatorData.map(function(arrayItem) { return arrayItem.simulatorname; }).indexOf(thisSimName);
  var thisSimObj = simulatorData[arrayIdx];

  $('#simulatorInfoName').text(thisSimObj.simulatorname);
  $('#simulatorInfoProp').text(thisSimObj.simulatorproperties);
  $('#simulatorInfoOp').text(thisSimObj.simulatoroperations);
  $('#simulatorInfoLoc').text(thisSimObj.simulatorlocation);
};

function addSimulator(event) {
  event.preventDefault();

  var errorCount = 0;
  $('#addSimulator input').each(function(idx, val) {
    if($(this).val() === '') { errorCount++; }
  });

  if (errorCount === 0) {
    var newSim = {
      'simulatorname': $('#addSimulator fieldset input#inputSimulatorName').val(),
      'simulatorproperties': $('#addSimulator fieldset input#inputSimulatorProp').val(),
      'simulatoroperations': $('#addSimulator fieldset input#inputSimulatorOp').val(),
      'simulatorlocation': $('#addSimulator fieldset input#inputSimulatorLoc').val()
    };

    $.ajax({
      type:'POST',
      data:newSim,
      url:'simulators/addSimulator',
      dataType:'JSON',
    }).done(function(res) {
      if (res.msg === '') {
        // initialize with the field placeholders
        $('#addSimulator fieldset input').val('');
        populateTable();
      } else {
        alert('Error: ' + res.msg);
      }
    }).fail(function() {
      alert('Server Unavailable');
    });
  } else {
    alert('Please fill up all of the cells in the table');
  }
};

function deleteSimulator(event) {
  event.preventDefault();

  var confirmation = confirm('Are you sure you want to remove this simulator?');

  // user checks the message and confirms that it is the right simulator to be removed
  if (confirmation === true) {
    $.ajax({
      type:'DELETE',
      url:'simulators/deleteSimulator',
      data: {id: $(this).attr('rel')}
    }).done(function(res) {
      if (res.msg === '') {}
      else {
        alert('Error: ' + res.msg);
      }
      populateTable();
    }).fail(function() {
      alert('Server Unavailable');
    });
  } else {
    return false;
  }
};