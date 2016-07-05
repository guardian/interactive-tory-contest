import iframeMessenger from 'guardian/iframe-messenger'
import reqwest from 'reqwest'
import d3 from 'd3'
import embedHTML from './text/embed.html!text'

window.init = function init(el, config) {



    iframeMessenger.enableAutoResize();

    el.innerHTML = embedHTML;

    	//http://www.theguardian.com/politics/2016/jun/26/labour-shadow-cabinet-resignations-jeremy-corbyn-who-has-gone

		//http://www.mirror.co.uk/news/uk-news/next-conservative-leader-elected-how-8327597

		d3.json('http://interactive.guim.co.uk/docsdata-test/1HV0KtuxIFqQkHdxOb8Nh6AnB-24-6stJXZ65q-9X-Ls.json', function(error,data){createApp(error,data)})


    /*reqwest({
        url: 'http://ip.jsontest.com/',
        type: 'json',
        crossOrigin: true,
        success: (resp) => el.querySelector('.test-msg').innerHTML = `Your IP address is ${resp.ip}`
    });*/


    function createApp(error, table)
	{
		var candidates = ['Theresa May','Michael Gove','Stephen Crabb','Liam Fox','Andrea Leadsom'];
		var data = table.sheets.Sheet1;
		var l = data.length;
		var day = false;
		var currentData;
		var array = [];
		var currentDay;

		var w = d3.select(window).on('resize', resize);
		var width = window.innerWidth;
		var margin = 90;
		


		for (var i = l-1; i >= 0; i--)
		{
			
			if(data[i]['day status'] == 'active' && !day)
			{
				day = true;
				currentDay = i+1;
				currentData = data[i];

				d3.select('#day' + String(currentDay))
				.attr('class', 'day active')


				for (var j = 1; j <= candidates.length; j++)
				{
					if(currentData['candidate' + j + ' status'] == 'active')
					{
						var name = currentData['candidate' + j].toLowerCase().split(' ').join('_');

						array.push({candidate:name, percentage: parseFloat(currentData['candidate' + j + ' percentage'])});
						
					} 
				}

				array.sort(function(x, y){
				   return d3.descending(x.percentage, y.percentage);
				})


				for (var k = 1; k <= array.length; k++)
				{
					
						var name = array[k-1].candidate.split("_").join(" ");
						var position = (width * array[k-1].percentage) / 100;
						var pMargin = (position * margin) / width;

						d3.selectAll('#day' + String(i +1))
						.append('div')
						.attr('class', 'person')
						.attr('id', 'person' + k)
						.append('div')
						.attr('class', 'person-bundle')
						.append('div')
						.attr('class' , 'person-img active')
						.append('img')
						.attr('src', config.assetPath + "/assets/imgs/" + array[k-1].candidate + ".jpg")

						d3.select('#person' + k + ' .person-bundle')
						.style("margin-left", position - pMargin + 'px')
						.append('div')
						.attr('class', 'person-name')
						.html(toTitleCase(name))
						.append('div')
						.attr('class', 'percentage')
						.html(array[k-1].percentage + '%')
				}


				if(array[array.length-1].percentage > 0)
				{
					var last = d3.select('#person' + array.length + ' .person-bundle .person-img')
					.attr('class', 'person-img inactive')
				}
				
				//makePositions()
			}
			else if(data[i]['day status'] == 'active' && day)
			{
				var pastarray = [];

				d3.select('#day' + String(i + 1))
				.attr('class', 'day active past');

				d3.select('#day' + String(i + 1))
				.append('div')
				.attr('class', 'people')

				for (var j = 1; j <= candidates.length; j++)
				{
					if(data[i]['candidate' + j + ' status'] == 'active')
					{
						var name = data[i]['candidate' + j].toLowerCase().split(' ').join('_');

						pastarray.push({candidate:name, percentage: parseFloat(data[i]['candidate' + j + ' percentage'])});
						
					} 
				}

				pastarray.sort(function(x, y){
				   return d3.descending(x.percentage, y.percentage);
				})


				for (var k = 1; k <= pastarray.length; k++)
				{
					
						var name = pastarray[k-1].candidate.split("_").join(" ");
						var position = (width * pastarray[k-1].percentage) / 100;
						var pMargin = (position * margin) / width;

						d3.select('#day' + String(i + 1) + ' .people')
						.append('div')
						.attr('class', 'person-past')
						.attr('id', 'person-past' + k)
						.append('div')
						.attr('class', 'person-bundle')
						.append('div')
						.attr('class' , 'person-img active')
						.append('img')
						.attr('src', config.assetPath + "/assets/imgs/" + pastarray[k-1].candidate + ".jpg")

						d3.select('#day' + String(i + 1) + ' .people #person-past' + k + ' .person-bundle' )
						.append('div')
						.attr('class', 'person-name')
						.html(toTitleCase(name))
				}


				if(pastarray[pastarray.length-1].percentage > 0)
				{
					var last = d3.select('#person-past' + pastarray.length + ' .person-bundle .person-img')
					.attr('class', 'person-img inactive');
				}
				
				
			}
			else
			{
				d3.select('#day' + String(i +1))
				.attr('class', 'day inactive')
			}

			resize()

		}

		function toTitleCase(str)
		{
		    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		}


		function resize()
		{
			var width = window.innerWidth;

			if(window.innerWidth >= 400)
			{


				for (var k = 1; k <= array.length; k++)
				{
					var position = (width * array[k-1].percentage) / 100;
					var pMargin = (position * margin) / width +20;

					d3.select('#day' + currentDay +  ' #person' + k + ' .person-bundle')
					.style("margin-left", (position - pMargin)+20 + 'px')
				}
				
			}
			else
			{
				d3.selectAll('#day' + currentDay +  ' .person-bundle')
				.style("margin-left", '0px')
			}
			
		}

		
	}



	


};




	