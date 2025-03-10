import cp from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { Err, Ok, type Result } from "ts-results";
import type { AuxiliaryStage } from "../types";
import { log } from "./log";

const AHK_EXE_PATH = "C:\\Program Files\\AutoHotkey\\v2\\AutoHotkey64.exe";
let AHK_EXIST_FLAG: boolean | undefined = undefined;

export function enableAhk() {
	if (AHK_EXIST_FLAG === undefined) {
		AHK_EXIST_FLAG = existsSync(AHK_EXE_PATH);
	}
	return AHK_EXIST_FLAG;
}

export async function runAuxiliary(
	scope: string,
	nepName: string,
	stage: AuxiliaryStage,
): Promise<Result<boolean, string>> {
	if (!enableAhk) {
		return new Err("Error:AutoHotKey not installed");
	}
	const auxPath = path.join("auxiliary", scope, nepName, `${stage}.ahk`);
	if (!existsSync(auxPath)) {
		return new Ok(false);
	}
	return new Promise((res) => {
		const cmd = auxPath;
		log(`Info:Running auxiliary script with command '${cmd}'`);
		cp.exec(cmd, (err, _stdout, stderr) => {
			const e = err || stderr;
			if (e) {
				res(
					new Err(
						`Error:Failed to run ${stage} auxiliary script with command '${cmd}'`,
					),
				);
			} else {
				log("Info:Auxiliary script exited");
				res(new Ok(true));
			}
		});
	});
}
