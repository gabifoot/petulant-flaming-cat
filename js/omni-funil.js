function show_configs() {

	$('.config-screen').addClass('mostrar-config');

}

function hide_configs() {

	$('.config-screen').addClass('esconder');

}

function show_container_configs(clicked) {

	$('.top-screen-config').removeClass('esconder');
	$('.' + clicked).removeClass('esconder');

}

function hide_container_configs() {

	$('.top-screen-config').addClass('esconder');
	$('.container-utm').addClass('esconder');

}

function show_metricas(clicked) {

	$(clicked).addClass('mostrar-metricas');

}

function hide_metricas(clicked) {

	$(clicked).parent().removeClass('metricas-ativas');
	$(clicked).parent().parent().addClass('esconder');
	if ($(clicked).parent().hasClass('dados-metricas')) {
		$(clicked).parent().find('.metricas-estagio3').addClass('esconder');
		$(clicked).parent().find('.metricas-estagio3').removeClass('mostrar-metricas');
		$(clicked).parent().find('.metricas-estagio3').children().removeClass('mostrar-ativas');
	};

}

function sum_grupos() {
	$('.dados-metricas').each(function() {
		
		var soma = 0;

		$(this).children('.table-metricas').find('.dados').each(function() {
			soma = soma + parseInt($(this).find('.metrica-valor').text().remove(/\./g));
		});

		$(this).children('.table-metricas').find('.dados').each(function() {
			var relacao = parseInt($(this).find('.metrica-valor').text().remove(/\./g)) / soma;
			var porcentagem = (100 * relacao).format(2, '.', ',');
			$(this).children('.col-1').children('.metrica-porcentagem').text(porcentagem);
		});

		soma = soma.format(0, '.', ',');

		var grupo = $(this).attr('class').remove(/dados-metricas |funil-.*/g);
		$('.' + grupo + ' tr.header span.metrica-valor').text(soma);

		var passo = grupo.replace(/dados/, 'passo');
		$('.' + passo + ' .metrica-valor').text(soma);

	});
}

function load_metricas() {

	var passo_anterior = null;
	var passo = null;

	$('.funil-passo').each(function() {
		if (passo_anterior != null) {

			passo = $(this).attr('class').replace(/ /g,'.');

			var passo_anterior_valor = parseInt($('.' + passo_anterior + '>.metrica-passo>.metrica-valor').text().remove(/\./g));
			var passo_valor = parseInt($('.' + passo + '>.metrica-passo>.metrica-valor').text().remove(/\./g));
			var relacao = passo_valor / passo_anterior_valor;

			//Calcula a porcentagem
			var porcentagem = (100 * relacao).format(2, '.', ',');
			$('.' + passo + '>.metrica-passo>.metrica-porcentagem').text(porcentagem);
			
			//Calcula o tamanho das barras
			var passo_anterior_barra = $('.' + passo_anterior + '>.metrica-grafico').width();
			$('.' + passo + '>.metrica-grafico').width(passo_anterior_barra * relacao);

			passo_anterior = passo;
		}
		else {
			passo_anterior = $(this).attr('class').replace(/ /g,'.');
		};
	});

}

$(function() {

	sum_grupos();
	load_metricas();

	//Funções dependendetes de eventos	
	var second = 1000; //1 segundo

	//Clicar em algum item da configuração
	$('.menu-config-options>a').click(function() {

		//Verifica a necesside de transição, caso a tela já esteja aberta ou não
		var time_modifier = $('.config-screen').is('.esconder') ? 1 : 0;

		//Trata os botões
		$('.menu-config-options').removeClass('ativo');
		var clicked_button = $(this).attr('class').replace(/option/, 'menu-configs');
		$('.' + clicked_button).addClass('ativo');

		//Trata o topo
		if ($(this).attr('class') == 'option-visualizar-utm') {
			$('.top-screen-config>ul.titulo>li').removeClass("esconder");
		}
		else {
			$('.top-screen-config>ul.titulo>li:not(.titulo-lista)').addClass("esconder");
		};
		
		//Trata o filtro de data
		$('.input-periodo-avaliacao').prop('disabled', true);

		//Trata a tela
		hide_container_configs();
		$('.config-screen').removeClass('esconder');
		var clicked_screen = $(this).attr('class').replace(/option/, 'container');
		setTimeout(function() { show_configs() }, 0.1*time_modifier*second);
		setTimeout(function() { show_container_configs(clicked_screen) }, 0.6*time_modifier*second); // 0.1 do timeout + 0.5 do transition no css

	});

	//Clicar em fechar tela de configuração
	$('.bt-voltar-funil').click(function() {

		//Trata os botões
		$('.menu-config-options').removeClass('ativo');

		//Trata o filtro de data
		$('.input-periodo-avaliacao').prop('disabled', false);

		//Trata a tela
		hide_container_configs();
		$('.config-screen').removeClass('mostrar-config');
		setTimeout(function() { hide_configs() }, 0.6*second);

	});

	//Clicar em algum nível do funil
	$('.funil-passo').click(function() {

		$('.metricas>div').removeClass('metricas-ativas');
		$('.metricas').removeClass('esconder');

		var clicked = $(this).attr('class').replace(/.*passo-/, 'dados-');
		$('.' + clicked).addClass('metricas-ativas');

		setTimeout(function() { show_metricas('.metricas') }, 0.1*second);

	});

	//Clicar em fechar alguma camada
	$('.fechar-metrica').click(function() {
		
		var clicked = this;
		$(this).parent().parent().removeClass('mostrar-metricas');
		setTimeout(function() { hide_metricas(clicked) }, 0.6*second); // 0.1 do timeout + 0.5 do transition no css

	});
	
	//Clicar em algum tipo, dentro do nível do funil
	$('.dados-metricas>.table-metricas .dados').click(function() {

		$(this).parents('.table-metricas').siblings('.metricas-estagio3').children().removeClass('metricas-ativas');
		$(this).parents('.table-metricas').siblings('.metricas-estagio3').removeClass('esconder');

		var clicked = $(this).find('.metrica-nome').text();
		$(this).parents('.table-metricas').siblings('.metricas-estagio3').children(':contains("' + clicked + '")').addClass('metricas-ativas');

		var classe = '.' + $(this).parents('.table-metricas').siblings('.metricas-estagio3').attr('class').replace(/ /g,'.');
		setTimeout(function() { show_metricas(classe) }, 0.1*second);

	});

	//Abrir menus dropdown
	$('.sub').hover(function() {

		$(this).toggleClass('open');
		$(this).children('ul').toggle();

	});

	//Selecionar opção dos menus dropdown
	$('.select-funil>li').click(function() {

		var chosen = $(this).text();
		$(this).parents('.sub').children('span').text(chosen);

		//Carrega os dados

	});
});