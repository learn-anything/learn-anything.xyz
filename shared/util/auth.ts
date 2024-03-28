import { default as Cookies } from "js-cookie"

export function getHankoCookie(): string {
	const hankoCookie = Cookies.get("hanko")
	return hankoCookie ?? ""
}

// TODO: should probably also check validity of token?
// right now it just checks that token exists but it can be expired
export function signedIn() {
	const hankoCookie = Cookies.get("hanko")
	return !!hankoCookie
}

// TODO: ideally I should not be calling this code manually
// it should be done as part of gql clients
// be called when you make a gql request that is not some public resolver
// would also be nice if I didn't have to pass navigate in but it seems I am forced to
export function isSignedIn(navigate: (path: string) => void) {
	if (!getHankoCookie()) {
		localStorage.setItem("pageBeforeSignIn", location.pathname)
		navigate("/auth")
		return false
	}
	return true
}
