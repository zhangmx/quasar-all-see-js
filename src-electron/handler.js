import { app, ipcMain, shell, dialog } from 'electron'
// import { app, ipcMain, shell, dialog, BrowserWindow } from 'electron'
import path from 'path'
import os from 'os'
import { pathExists, readFileSync, writeFile } from 'fs-extra'
import mime from 'mime'

import walkFolders from './walkFolders'
import windowsDrives from './getWindowsDrives'

export function useHandler(mainWindow) {
  ipcMain.handle('myShell:walkFolders', async (event, path) => {
    const folders = []
    for (const fileInfo of walkFolders(path, 0)) {
      if (fileInfo.isDir && !fileInfo.error) {
        fileInfo.children = []
      }
      folders.push(fileInfo)
    }
    return folders
  })

  ipcMain.handle('myShell:windowsDrives', async () => {
    return new Promise((resolve, reject) => {
      const localDrives = []
      windowsDrives((error, drives) => {
        if (!error) {
          localDrives.splice(0, localDrives.length, ...drives)
          resolve(localDrives)
        }
        else {
          console.error(error)
          reject(error)
        }
      })
    })
  })

  ipcMain.handle('myShell:shortcutFolders', async () => {
    const home = app.getPath('home')
    const desktop = app.getPath('desktop')
    const document = app.getPath('documents')
    const download = app.getPath('downloads')
    const picture = app.getPath('pictures')
    const audio = app.getPath('music')
    const video = app.getPath('videos')

    const shortcuts = {
      home,
      desktop,
      document,
      download,
      picture,
      audio,
      video
    }

    return shortcuts
  })

  ipcMain.handle('myShell:sep', async () => {
    return path.sep
  })

  ipcMain.handle('myShell:platform', async () => {
    return os.platform()
  })

  ipcMain.handle('myShell:pathExists', async (event, path) => {
    return await pathExists(path)
  })

  ipcMain.handle('myShell:openFile', async (event, path) => {
    // open the file as specified by the user
    return await shell.openPath(path)
  })

  ipcMain.handle('myShell:readFile', async (event, path) => {
    return readFileSync(path)
  })

  ipcMain.handle('myShell:getMimeType', async (event, path) => {
    return mime.lookup(path)
  })

  ipcMain.handle('myShell:selectFolder', async () => {
    // const focusedWindow = BrowserWindow.getFocusedWindow()
    // dialog.showOpenDialog(focusedWindow, { properties: ['openDirectory'] }, async (filePaths) => {
    //   // 获取当前窗口引用
    //   const currentWindow = BrowserWindow.fromId(focusedWindow.id)

    //   // 将当前窗口置顶
    //   // currentWindow.setAlwaysOnTop(true)

    //   // 显示对话框
    // await dialog.showOpenDialog(currentWindow, { properties: ['openDirectory'] })

    //   // 关闭对话框后,取消置顶当前窗口
    //   // currentWindow.setAlwaysOnTop(false)
    // });
    return await dialog.showOpenDialogSync(mainWindow, { properties: ['openDirectory'] });
    // mainWindow.setAlwaysOnTop(true)
    // const folder = await dialog.showOpenDialogSync(mainWindow, { properties: ['openDirectory'] });
    // mainWindow.setAlwaysOnTop(false)
    // return folder;

    // const dialogWindow = new BrowserWindow({
    //   width: 0,
    //   height: 0
    // })
    // dialogWindow.loadURL('about:blank')
    // dialogWindow.hide()
    // // dialogWindow.setAlwaysOnTop(true)
    // dialogWindow.setAlwaysOnTop(true, 'floating', 1)
    // const folder = dialog.showOpenDialog(dialogWindow, { properties: ['openDirectory'] })
    // // const folder = await dialog.showOpenDialogSync(dialogWindow, { properties: ['openDirectory'] });
    // dialogWindow.setAlwaysOnTop(false)
    // dialogWindow.destroy()
    // return folder

    // dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] }, (filePaths) => {
    //   const dialogWindow = BrowserWindow.getAllWindows().find(w => w.isModal())
    //   console.log('showOpenDialog', filePaths)
    //   console.log(filePaths)
    //   console.log(dialogWindow)
    //   dialogWindow.on('closed', () => {
    //     dialogWindow.destroy()
    //   })
    // })
  })

  ipcMain.handle('myShell:saveVideo', async (event, fileFolder, arrayBuffer) => {
    const filename = new Date().getTime() + '.webm';
    const filePath = path.join(fileFolder, filename);

    const buffer = Buffer.from(arrayBuffer);

    writeFile(filePath, buffer, err => {
      if (!err) {
        event.sender.send('video-saved');
        // return filePath;
      }
    });

    return filePath;
  })
}
