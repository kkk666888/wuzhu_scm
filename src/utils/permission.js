const permission = {
  menuButtons: [],
  getRouteByCode(routes, code) {
    let result = null;

    if (routes && routes.length > 0) {
      for (var i in routes) {
        if (routes[i].meta.code && routes[i].meta.code == code) {
          result = routes[i];
          break;
        }

        result = this.getRouteByCode(routes[i].children, code);

        if (result) {
          break;
        }
      }
    }

    return result;
  },
  //处理用户权限
  getUserPermissionMenus(resources) {
    let result = {
      menus: [],
      menuButtons: resources.buttonList,
      simpleMenus: []
    };

    this.recursionHandleResource(resources.menuTree, result);

    this.menuButtons = resources.buttonList;
    return result;
  },
  //递归处理权限数据
  recursionHandleResource(resources, result, menus) {
    if (resources && resources.length > 0) {
      resources.forEach(item => {
        let resourceType = item.resourceType.toLowerCase();

        switch (resourceType) {
          case 'dirt':
          case 'menu':
            let model = this.getModel(item);
            result.simpleMenus.push({ code: item.resourceCode });

            if (item.children && item.children.length > 0) {
              this.recursionHandleResource(item.children, result, model.children);
            }

            if (model.children.length == 0) {
              model.leaf = true;
            }

            if (menus) {
              menus.push(model);
            } else {
              result.menus.push(model);
            }

            break;
        }
      });
    }
  },
  getModel(item) {
    let model = {
      children: []
    };

    for (var i in item) {
      if (i === 'children') {
        model.children = [];
        continue;
      }

      model[i] = item[i];
    }

    return model;
  },
  //根据code获取菜单
  getMenuByCode(menus, code) {
    let result = this.recursionMenuByCode(menus, code);
    return result;
  },
  recursionMenuByCode(menus, code) {
    let result = null;

    if (menus && menus.length > 0) {
      for (var i in menus) {
        if (menus[i].resourceCode == code) {
          result = menus[i];
          break;
        }

        if (menus[i].children && menus[i].children.length > 0) {
          result = this.recursionMenuByCode(menus[i].children, code);

          if (result) {
            break;
          }
        }
      }
    }

    return result;
  },
  //根据code获取按扭权限
  getButtonItemByCode(code) {
    let result = null;

    if (this.menuButtons && this.menuButtons.length > 0) {
      for (var i in this.menuButtons) {
        if (this.menuButtons[i].resourceCode == code) {
          result = this.menuButtons[i];
          break;
        }
      }
    }

    return result;
  },
  //返回权限按扭
  getHtmlBtnByCode(h, code, func) {
    let btn = null;

    let permissionBtn = this.getButtonItemByCode(code);

    if (permissionBtn) {
      btn = (
        <el-button
          type="primary"
          icon={permissionBtn.resourceIcon}
          onClick={() => {
            if (func && func instanceof Function) {
              func();
            }
          }}
        >
          {permissionBtn.resourceName}
        </el-button>
      );
    }

    return btn;
  },
  //判断是否有权限
  hasMenuPermission(route, simpleMenus) {
    let result = false;

    if (route.name == 'index') {
      return true;
    }

    if (route.meta.authority) {
      if (simpleMenus && simpleMenus.length > 0) {
        for (var i in simpleMenus) {
          if (simpleMenus[i].code == route.meta.code) {
            result = true;
            break;
          }
        }
      }
    } else {
      result = true;
    }

    return result;
  }
};

export default permission;
