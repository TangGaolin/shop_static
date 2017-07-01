import { fetch } from '../utils/fetch';


export function getConfig(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/getConfig',
        method: 'post',
        data
    });
}

export function login(params) {
	const data = params
	return fetch({
		url:  process.env.API_ROOT + '/shop/login',
		method: 'post',
		data
	});
}

export function logout(params) {
	const data = params
	return fetch({
		url:  process.env.API_ROOT + '/shop/logout',
		method: 'post',
		data
	});
}

export function getEmployeeList(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/getEmployeeList',
        method: 'post',
        data
    });
}


export function addUser(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/addUser',
        method: 'post',
        data
    });
}

export function getUserDetail(params) {
    const data = params
    return fetch({
        url:  process.env.API_ROOT + '/shop/getUserDetail',
        method: 'post',
        data
    });
}


